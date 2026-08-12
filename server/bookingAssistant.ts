import type { ChatHistoryItem } from "./chatAssistant";
import { getRequestedPricedServices, getServiceDisplayLabel } from "./compositeOrderPricing";

const BOOKING_INTENT = /(?:احجز|حجز|موعد|زيارة|أرسل.{0,8}فني|ابغى.{0,12}(?:فني|موعد)|أبي.{0,12}(?:فني|موعد)|أريد.{0,12}(?:فني|موعد))/i;
const TIME_PATTERN = /(?:اليوم|بكر(?:ه|ة)|غد(?:اً|ا)?|صباح(?:اً)?|مساء(?:ً)?|بعد\s+الظهر|\d{1,2}\s*(?:ص|م|صباحاً?|مساءً?))/i;
const LOCATION_PATTERN = /(?:حي|الحي)\s+(.+?)(?=\s+(?:اليوم|بكر(?:ه|ة)|غد(?:اً|ا)?|صباح(?:اً)?|مساء(?:ً)?|بعد\s+الظهر|\d{1,2}\s*(?:ص|م))|[،.\n]|$)|في\s+(.+?)(?=\s+(?:اليوم|بكر(?:ه|ة)|غد(?:اً|ا)?|صباح(?:اً)?|مساء(?:ً)?|بعد\s+الظهر|\d{1,2}\s*(?:ص|م))|[،.\n]|$)/i;

function userConversationText(history: ChatHistoryItem[] | undefined, message: string) {
  return [...(history ?? []).filter(item => item.role === "user").map(item => item.content), message].join("\n");
}

export function isBookingConversation(history: ChatHistoryItem[] | undefined, message: string) {
  return BOOKING_INTENT.test(userConversationText(history, message));
}

export function buildBookingReply(history: ChatHistoryItem[] | undefined, message: string) {
  if (!isBookingConversation(history, message)) return null;

  const services = getRequestedPricedServices(history, message);
  const conversation = userConversationText(history, message);
  const locationMatch = conversation.match(LOCATION_PATTERN);
  const location = locationMatch?.[1]?.trim() ? `حي ${locationMatch[1].trim()}` : locationMatch?.[2]?.trim();
  const time = conversation.match(TIME_PATTERN)?.[0]?.trim();

  if (services.length === 0) {
    return "تمام، وش الخدمة اللي تحتاجها؟";
  }

  const serviceNames = services.map(service => getServiceDisplayLabel(service, conversation)).join("، ");
  if (!location) {
    return `تمام، طلبك: ${serviceNames}. أي حي مناسب لك؟`;
  }

  if (!time) {
    return `تمام، ${serviceNames} في ${location}. متى يناسبك الموعد؟`;
  }

  return `تم تسجيل طلبك: ${serviceNames}، ${location}، ${time}. أرسل اسمك ورقمك للتأكيد.`;
}
