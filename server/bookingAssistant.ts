import type { ChatHistoryItem } from "./chatAssistant";
import { getRequestedPricedServices } from "./compositeOrderPricing";

const BOOKING_INTENT = /(?:احجز|حجز|موعد|زيارة|أرسل.{0,8}فني|ابغى.{0,12}(?:فني|موعد)|أبي.{0,12}(?:فني|موعد)|أريد.{0,12}(?:فني|موعد))/i;
const TIME_PATTERN = /(?:اليوم|بكر(?:ه|ة)|غد(?:اً|ا)?|صباح(?:اً)?|مساء(?:ً)?|بعد\s+الظهر|\d{1,2}\s*(?:ص|م|صباحاً?|مساءً?))/i;
const LOCATION_PATTERN = /(?:حي|الحي)\s+(.+?)(?=\s+(?:اليوم|بكر(?:ه|ة)|غد(?:اً|ا)?|صباح(?:اً)?|مساء(?:ً)?|بعد\s+الظهر|\d{1,2}\s*(?:ص|م))|[،.\n]|$)|في\s+(.+?)(?=\s+(?:اليوم|بكر(?:ه|ة)|غد(?:اً|ا)?|صباح(?:اً)?|مساء(?:ً)?|بعد\s+الظهر|\d{1,2}\s*(?:ص|م))|[،.\n]|$)/i;
const PHONE_PATTERN = /(?:\+?966|00966|0)5\d{8}/;

function userConversationText(history: ChatHistoryItem[] | undefined, message: string) {
  return [...(history ?? []).filter(item => item.role === "user").map(item => item.content), message].join("\n");
}

function extractCustomerName(history: ChatHistoryItem[] | undefined, message: string) {
  return [...(history ?? []), { role: "user" as const, content: message }]
    .filter(item => item.role === "user")
    .map(item => item.content.replace(PHONE_PATTERN, "").trim())
    .reverse()
    .find(value => {
      const wordCount = value.split(/\s+/).filter(Boolean).length;
      return /^[\u0600-\u06FF\s]+$/.test(value)
        && wordCount >= 1 && wordCount <= 3
        && !TIME_PATTERN.test(value) && !LOCATION_PATTERN.test(value)
        && !BOOKING_INTENT.test(value);
    });
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
  const customerName = extractCustomerName(history, message);
  const customerPhone = conversation.match(PHONE_PATTERN)?.[0];

  if (services.length === 0) {
    return "تمام، وش الخدمة اللي تحتاجها؟";
  }

  const serviceNames = services.map(service => service.displayName ?? service.name).join("، ");
  if (!location) {
    return `تمام، طلبك: ${serviceNames}. أي حي مناسب لك؟`;
  }

  if (!time) {
    return `تمام، ${serviceNames} في ${location}. متى يناسبك الموعد؟`;
  }

  if (!customerName) {
    return `تم تسجيل طلبك: ${serviceNames}، ${location}، ${time}. أرسل اسمك ورقمك للتأكيد.`;
  }
  if (!customerPhone) {
    return `تمام يا ${customerName}. أرسل رقم جوالك لتأكيد الحجز.`;
  }
  return `تم تأكيد حجزك: ${serviceNames}، ${location}، ${time}. أرسله إلى واتساب ليصل للفني.`;
}
