import { serviceCatalog } from "./serviceCatalog";

export type InternalPriceReference = {
  name: string;
  price: string;
  unit?: string;
};

const PRICE_QUESTION = /(?:بكم|كم(?:\s+سعر)?|السعر|تكلفة|بكام|كم\s+يكلف)/i;

type ConversationTurn = { role: "user" | "assistant"; content: string };

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[إأآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\u0600-\u06FFA-Za-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreMatch(message: string, phrase: string) {
  const normalizedPhrase = normalize(phrase);
  if (!normalizedPhrase || normalizedPhrase.length < 3) return 0;
  if (message.includes(normalizedPhrase)) return normalizedPhrase.length + 20;

  const words = normalizedPhrase.split(" ").filter(word => word.length >= 3);
  const matches = words.filter(word => message.includes(word));
  return matches.length >= 2 ? matches.length * 3 : 0;
}

export function isPriceEnquiry(message: string) {
  return PRICE_QUESTION.test(message);
}

export function findInternalPriceReferences(message: string, history: ConversationTurn[] = []): InternalPriceReference[] {
  if (!isPriceEnquiry(message)) return [];

  const customerContext = [...history.filter(turn => turn.role === "user").map(turn => turn.content), message].join(" ");
  const normalizedMessage = normalize(customerContext);
  const matches: { item: InternalPriceReference; score: number }[] = [];

  for (const item of serviceCatalog) {
    const phrases = [item.name, item.displayName, ...(item.aliases ?? [])].filter(Boolean) as string[];
    const score = Math.max(...phrases.map(phrase => scoreMatch(normalizedMessage, phrase)));
    if (score >= 6) {
      matches.push({ item: { name: item.name, price: item.price, unit: item.unit }, score });
    }
  }

  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(match => match.item);
}

export function buildInternalPriceHint(references: InternalPriceReference[], isPriceQuestion: boolean) {
  if (!isPriceQuestion) return "";

  if (references.length === 0) {
    return "لا يوجد نطاق داخلي موثوق لهذه الخدمة في هذه المحادثة؛ لا تخترع رقماً محدداً، واطلب التفصيل اللازم أو وضّح أن السعر النهائي يحدده الفني المختص بعد معرفة الحالة.";
  }

  const services = references
    .map(reference => `«${reference.name}»: ${reference.price}${reference.unit ? ` (${reference.unit})` : ""}`)
    .join("؛ ");
  const responseShape = references.length > 1
    ? "اذكر نطاق كل خدمة على حدة، ولا تجمع الأسعار إلا إذا طلب العميل الإجمالي."
    : "استخدم نطاق الخدمة المطابقة فقط بصياغة طبيعية.";

  return `معلومة سعر داخلية غير ظاهرة للعميل: ${services}. عند الرد على سؤال السعر، ${responseShape} لا تذكر أن لها مرجعاً داخلياً أو اسم مدينة. وضّح باختصار أن السعر النهائي يحدده الفني المختص بعد المعاينة أو معرفة التفاصيل.`;
}
