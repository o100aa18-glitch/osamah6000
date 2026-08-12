export const CHAT_MODEL = "gemini-3.5-flash";

export type ChatHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

export const WHATSAPP_READY_MARKER = "[[WHATSAPP_READY]]";

export function buildChatSystemPrompt() {
  return `أنت AI OSAMAH711X، مساعد فني لموقع المهندس أسامة البعوي. تحدث كفني إنساني فاهم، طبيعي، مهني، ودود؛ لا تتصرف كنموذج حجز أو قائمة خدمات.

مجالك فقط: الكهرباء، السباكة، التكييف، والكاميرات والأنظمة المنزلية المرتبطة بها. أجب بحرية عن الاستفسارات العامة والفضول الفني والأعطال وطلبات الخدمات داخل هذه المجالات. افهم اللهجة العامية والسياق، وقدّم قيمة حقيقية: شرح مختصر، أسباب محتملة، مقارنة، توجيه آمن، أو سؤال مناسب عندما تحتاجه. اجعل الرد بطول ما يحتاجه المعنى: مختصر وواضح دائماً، ومكتمل لا مبتور.

لا تفرض مساراً أو أسئلة ثابتة. إذا كان حديث العميل يشير طبيعياً إلى حاجة لفني، تستطيع أن تعرض عليه المساعدة في ترتيب زيارة بصياغة بشرية مناسبة. وإذا اختار العميل خلال الحوار إرسال طلب لفني، اجمع التفاصيل التي تحتاجها بشكل طبيعي داخل نفس الحديث. عندما تكون تفاصيل الطلب كافية لإرسالها للفني، أضف في نهاية ردك فقط الرمز ${WHATSAPP_READY_MARKER}. لا تشرح الرمز ولا تذكره للعميل.

في التسعير: أعطِ سعراً مباشراً وواثقاً بالريال للخدمات ضمن مجالك حتى إن لم تكن معروضة في الموقع. استخدم مرجع السعر الداخلي الذي لا يقل عن الحد المقبول، ولا توافق على سعر أدنى عند التفاوض. لا تذكر اسم مدينة ولا عبارة «سعر السوق» ولا تشرح مرجع التسعير للعميل. لا تخترع خدمة أو معلومة غير مؤكدة؛ إذا أثّر تفصيل فني فعلاً على السعر، اسأل عنه ببساطة.`;
}

export function normalizeConversationHistory(history: ChatHistoryItem[] | undefined) {
  return (history ?? [])
    .filter(item => item.content.trim().length > 0)
    .slice(-6)
    .map(item => ({ ...item, content: item.content.trim().slice(-360) }));
}

const FALLBACK_COMPLETE_REPLY = "أبشر، وضّح لي طلبك أو مشكلتك وسأعطيك جواباً مباشراً.";

function lastCompleteSentence(reply: string) {
  const sentenceEndingPattern = /[.!؟?…]+/g;
  let lastEndingIndex = -1;
  let lastEndingLength = 0;
  let match: RegExpExecArray | null;

  while ((match = sentenceEndingPattern.exec(reply)) !== null) {
    lastEndingIndex = match.index;
    lastEndingLength = match[0].length;
  }

  return lastEndingIndex >= 0
    ? reply.slice(0, lastEndingIndex + lastEndingLength).trim()
    : "";
}

export function sanitizeClientReply(reply: string, finishReason?: string) {
  const cleanedReply = reply
    .replace(/\*{1,3}\s*draft\s*\d*\s*[:：-]?\s*\*{0,3}/gi, "")
    .replace(/[`*_#]/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(?:متوسط\s+)?سعر\s+سوق\s+مكة(?:\s+المكرمة)?/gi, "السعر")
    .replace(/(?:متوسط\s+)?سوق\s+مكة(?:\s+المكرمة)?/gi, "السعر")
    .replace(/أسعار\s+مكة(?:\s+المكرمة)?/gi, "الأسعار")
    .replace(/في\s+مكة(?:\s+المكرمة)?/gi, "ضمن نطاق الخدمة")
    .replace(/مكة\s+المكرمة/gi, "نطاق الخدمة")
    .replace(/مكة/gi, "نطاق الخدمة")
    .trim();

  const replyWithoutFinalPunctuation = cleanedReply.replace(/[.!؟?…]+$/, "").trim();
  const lastWord = replyWithoutFinalPunctuation.split(/\s+/).at(-1) ?? "";
  const endsWithIncompleteConnector = /(?:\b(?:من|إلى|الى|عن|مع|في|أو|او|و)\s*|\d{1,2}\s*)$/i.test(replyWithoutFinalPunctuation);
  const hasPartialPriceRange = /(?:(?:يصل|تصل)\s+(?:إلى|الى)\s*|(?:من|إلى|الى)\s+)\d{1,2}$/i.test(replyWithoutFinalPunctuation);
  const endsWithPartialArabicWord = /^[\u0621-\u064A]{1,2}$/.test(lastWord);
  if (endsWithIncompleteConnector || hasPartialPriceRange || endsWithPartialArabicWord) {
    return FALLBACK_COMPLETE_REPLY;
  }

  if (finishReason === "MAX_TOKENS") {
    return lastCompleteSentence(cleanedReply) || FALLBACK_COMPLETE_REPLY;
  }

  return cleanedReply || FALLBACK_COMPLETE_REPLY;
}
