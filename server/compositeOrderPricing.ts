import type { ChatHistoryItem } from "./chatAssistant";
import { serviceCatalog, type ServiceCatalogItem } from "./serviceCatalog";

const PRICE_INTENT = /(?:بكم|كم(?:\s+السعر|\s+تكلف|\s+يطلع)?|سعر|تكلفة|الإجمال|الحساب|المجموع)/i;
const PRICE_OBJECTION_INTENT = /(?:السعر\s*(?:غالي|مرتفع)|غالي|مرتف(?:ع|عه)|خصم|خف(?:ف|ض)|نز(?:ل|لي))/i;

export function isPricingFollowUp(message: string) {
  const trimmedMessage = message.trim();
  return !PRICE_OBJECTION_INTENT.test(trimmedMessage) && PRICE_INTENT.test(trimmedMessage);
}

function toWesternDigits(value: string) {
  return value.replace(/[٠-٩]/g, digit => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

function getServiceQuantity(service: ServiceCatalogItem, text: string) {
  if (!service.unit) return 1;
  const unitPattern = service.unit === "للنقطة" ? "نق(?:طه|طة|اط)" : service.unit === "للمتر" ? "متر" : "حبه|حبة";
  const match = toWesternDigits(text).match(new RegExp(`(\\d+)\\s*${unitPattern}`, "i"));
  return match ? Number(match[1]) : null;
}

const STOP_WORDS = new Set(["ابي", "ابغى", "اريد", "احتاج", "تركيب", "تغيير", "اصلاح", "او", "من", "الى", "على", "في", "مع", "عن", "هذا", "هذه", "عادي"]);

function normalizeArabic(text: string) {
  return text
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/[^a-z0-9\u0600-\u06ff\s]/gi, " ");
}

function getKeywords(text: string) {
  return normalizeArabic(text)
    .split(/\s+/)
    .flatMap(word => word.startsWith("و") && word.length > 3 ? [word, word.slice(1)] : [word])
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

function serviceMatchScore(service: ServiceCatalogItem, orderWords: Set<string>) {
  const candidates = [service.name, ...(service.aliases ?? [])];
  return Math.max(...candidates.map(candidate => getKeywords(candidate).filter(word => orderWords.has(word)).length));
}

function getServicesFromText(text: string, preferSpecificMixerIntent = false) {
  const normalizedText = normalizeArabic(text);
  const mixerInstall = serviceCatalog.find(service => service.id === "p19");
  const hiddenMixerInstall = serviceCatalog.find(service => service.id === "p20");
  if (preferSpecificMixerIntent && /(?:خلاط)/.test(normalizedText) && /(?:مخفي|دفن)/.test(normalizedText) && hiddenMixerInstall) {
    return [hiddenMixerInstall];
  }
  if (preferSpecificMixerIntent && /(?:خلاط)/.test(normalizedText) && /(?:دش|شاور|مغسله|مجلى|مجلي|مطبخ|تركيب)/.test(normalizedText) && mixerInstall) {
    return [mixerInstall];
  }

  const orderWords = new Set(getKeywords(text));
  const matches = serviceCatalog
    .map(service => ({ service, score: serviceMatchScore(service, orderWords) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score);
  const minimumScore = matches.some(({ score }) => score >= 2) ? 2 : 1;
  return matches
    .filter(({ score }) => score >= minimumScore)
    .map(({ service }) => service);
}

export function getRequestedPricedServices(history: ChatHistoryItem[] | undefined, message: string) {
  const orderText = [...(history ?? []).filter(item => item.role === "user").map(item => item.content), message].join("\n");
  return getServicesFromText(orderText);
}

function getMostRecentServiceContext(history: ChatHistoryItem[] | undefined, message: string) {
  const recentUserMessages = [
    message,
    ...(history ?? []).slice().reverse().filter(item => item.role === "user").map(item => item.content),
  ];

  for (const text of recentUserMessages) {
    const services = getServicesFromText(text, true);
    if (services.length > 0) return { services, text };
  }
  return null;
}

export function getServiceDisplayLabel(service: ServiceCatalogItem, contextText = "") {
  // الخدمة p19 تضم عدة أنواع خلاطات؛ الاسم المعروض يجب أن يتبع آخر نوع ذكره العميل.
  if (service.id === "p19") {
    const normalizedContext = normalizeArabic(contextText);
    if (/(?:دش|شاور|بانيو|جاكوزي)/.test(normalizedContext)) return "تركيب خلاط دش";
    if (/(?:مجلى|مجلي|مطبخ)/.test(normalizedContext)) return "تركيب خلاط مجلى";
    return "تركيب خلاط مغسلة";
  }
  return service.displayName ?? service.name;
}

function directPrice(service: ServiceCatalogItem) {
  const values = service.price.match(/\d+/g)?.map(Number) ?? [];
  if (values.length === 0) return 0;
  const rawPrice = values.length === 1 ? values[0] : (values[0] + values[1]) / 2;
  return Math.round(rawPrice / 5) * 5;
}

function lowestAllowedPrice(service: ServiceCatalogItem) {
  const values = service.price.match(/\d+/g)?.map(Number) ?? [];
  return values.length > 0 ? Math.ceil(values[0] / 5) * 5 : directPrice(service);
}

function negotiatedPrice(service: ServiceCatalogItem) {
  return Math.max(lowestAllowedPrice(service), directPrice(service) - 10);
}

function servicePriceLine(service: ServiceCatalogItem, contextText: string, quantity?: number | null) {
  const label = getServiceDisplayLabel(service, contextText);
  if (service.unit && quantity) {
    const quantityLabel = service.unit === "للنقطة" ? "نقاط" : service.unit === "للمتر" ? "متر" : "حبة";
    return `${label}: ${directPrice(service) * quantity} ريال (${quantity} ${quantityLabel})`;
  }
  return `${label}: ${directPrice(service)} ريال${service.unit ? ` ${service.unit}` : ""}`;
}

function isAwaitingQuantity(history: ChatHistoryItem[] | undefined) {
  const lastAssistantMessage = [...(history ?? [])].reverse().find(item => item.role === "assistant")?.content ?? "";
  return /كم\s+(?:نقطة|متر|حبة)\s+تحتاج/.test(lastAssistantMessage);
}

function hasActivePricingContext(history: ChatHistoryItem[] | undefined) {
  const lastAssistantMessage = [...(history ?? [])].reverse().find(item => item.role === "assistant")?.content ?? "";
  return /(?:\d+\s*ريال|السعر|التكلفة|بكم)/.test(lastAssistantMessage);
}

// إذا أكمل العميل طلباً بعد أن سأل عن السعر، نقرأ الخدمة الجديدة من رسالته الحالية فقط.
export function buildContextualPricingReply(history: ChatHistoryItem[] | undefined, message: string) {
  if (isPricingFollowUp(message) || !hasActivePricingContext(history)) return null;
  const services = getServicesFromText(message, true);
  if (services.length === 0) return null;

  return services.map(service => servicePriceLine(service, message)).join("، ") + ".";
}

// اعتراض «غالي» ليس طلباً جديداً؛ هو تفاوض على آخر خدمة فهمها المساعد.
export function buildPriceObjectionReply(history: ChatHistoryItem[] | undefined, message: string) {
  if (!PRICE_OBJECTION_INTENT.test(message.trim())) return null;
  const context = getMostRecentServiceContext(history, message);
  const service = context?.services[0];
  if (!service) return null;

  if (service.id === "p19") {
    return `أبشر، إذا الخلاط جاهز والتركيب عادي أقدر أرتبه لك بـ${negotiatedPrice(service)} ريال. يناسبك؟`;
  }

  return `أبشر، أقدر أرتب ${getServiceDisplayLabel(service, context!.text)} بـ${negotiatedPrice(service)} ريال${service.unit ? ` ${service.unit}` : ""} إذا كان العمل عادياً ولا يحتاج قطع إضافية. يناسبك؟`;
}

export function buildCompositePricingReply(history: ChatHistoryItem[] | undefined, message: string) {
  if (!isPricingFollowUp(message) && !isAwaitingQuantity(history)) return null;

  const services = getRequestedPricedServices(history, message);
  if (services.length === 0) return null;

  const orderText = [...(history ?? []).filter(item => item.role === "user").map(item => item.content), message].join("\n");
  const quantities = new Map(services.map(service => [service.id, getServiceQuantity(service, orderText)]));
  const lines = services.map(service => servicePriceLine(service, orderText, quantities.get(service.id)));
  const hasMissingQuantity = services.some(service => service.unit && !quantities.get(service.id));
  const total = services.reduce((sum, service) => sum + directPrice(service) * (quantities.get(service.id) ?? 1), 0);

  const totalLine = !hasMissingQuantity && services.length > 1 ? `الإجمالي: ${total} ريال.` : "";
  const detailLine = services.find(service => service.unit && !quantities.get(service.id))?.needsDetail;
  return [
    lines.join("، ") + ".",
    totalLine,
    detailLine ? `كم ${detailLine}؟` : "",
  ].filter(Boolean).join(" ");
}
