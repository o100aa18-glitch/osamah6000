import type { ChatHistoryItem } from "./chatAssistant";
import { serviceCatalog, type ServiceCatalogItem } from "./serviceCatalog";

const PRICE_INTENT = /(?:بكم|كم(?:\s+السعر|\s+تكلف|\s+يطلع)?|سعر|تكلفة|الإجمال|الحساب|المجموع)/i;

export function isPricingFollowUp(message: string) {
  return PRICE_INTENT.test(message.trim());
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

const STOP_WORDS = new Set(["ابي", "ابغى", "اريد", "احتاج", "او", "من", "الى", "على", "في", "مع", "عن", "هذا", "هذه", "عادي"]);

function normalizeArabic(text: string) {
  return text
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/[؟،؛]/g, " ")
    .replace(/[^a-z0-9\u0600-\u06ff\s]/gi, " ");
}

function getKeywords(text: string) {
  return normalizeArabic(text)
    .split(/\s+/)
    .map(word => word.startsWith("ال") && word.length > 4 ? word.slice(2) : word)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

function serviceMatchScore(service: ServiceCatalogItem, orderWords: Set<string>, orderPhrase: string) {
  const candidates = [service.name, ...(service.aliases ?? [])];
  return Math.max(...candidates.map(candidate => {
    const candidateWords = getKeywords(candidate);
    const candidatePhrase = candidateWords.join(" ");
    if (candidateWords.length > 1 && orderPhrase.includes(candidatePhrase)) {
      return 100 + candidateWords.length;
    }
    return candidateWords.filter(word => orderWords.has(word)).length;
  }));
}

export function getRequestedPricedServices(history: ChatHistoryItem[] | undefined, message: string) {
  const orderText = [...(history ?? []).filter(item => item.role === "user").map(item => item.content), message].join("\n");
  const orderKeywords = getKeywords(orderText);
  const orderWords = new Set(orderKeywords);
  const orderPhrase = orderKeywords.join(" ");
  const matches = serviceCatalog
    .map(service => ({ service, score: serviceMatchScore(service, orderWords, orderPhrase) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score);
  const minimumScore = matches.some(({ score }) => score >= 100)
    ? 100
    : matches.some(({ score }) => score >= 2) ? 2 : 1;
  return matches
    .filter(({ score }) => score >= minimumScore)
    .map(({ service }) => service);
}

function directPrice(service: ServiceCatalogItem) {
  const values = service.price.match(/\d+/g)?.map(Number) ?? [];
  if (values.length === 0) return 0;
  const rawPrice = values.length === 1 ? values[0] : (values[0] + values[1]) / 2;
  return Math.round(rawPrice / 5) * 5;
}

export function buildCompositePricingReply(history: ChatHistoryItem[] | undefined, message: string) {
  const priorPriceQuestion = (history ?? []).some(item => item.role === "assistant" && /كم\s+(?:نقطة|متر|حبة)\s+تحتاج/.test(item.content));
  if (!isPricingFollowUp(message) && !priorPriceQuestion) return null;

  const services = getRequestedPricedServices(history, message);
  if (services.length === 0) return null;

  const orderText = [...(history ?? []).filter(item => item.role === "user").map(item => item.content), message].join("\n");
  const quantities = new Map(services.map(service => [service.id, getServiceQuantity(service, orderText)]));

  const lines = services.map(service => {
    const quantity = quantities.get(service.id);
    if (service.unit && quantity) {
      const quantityLabel = service.unit === "للنقطة" ? "نقاط" : service.unit === "للمتر" ? "متر" : "حبة";
      return `${service.displayName ?? service.name}: ${directPrice(service) * quantity} ريال (${quantity} ${quantityLabel})`;
    }
    return `${service.displayName ?? service.name}: ${directPrice(service)} ريال${service.unit ? ` ${service.unit}` : ""}`;
  });
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
