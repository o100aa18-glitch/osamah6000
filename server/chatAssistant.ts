export const CHAT_MODEL = "gemini-3.5-flash";

export type ChatHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

export function buildChatSystemPrompt() {
  return `أنت AI OSAMAH711X، مساعد فني احترافي لموقع المهندس أسامة البعوي. افهم وصف العميل العامي وسياق الحوار كما يفعل فني خبير، وتحدث بعربية طبيعية مهنية ودودة.

في الاستفسار الفني: حدّد المقصود أولاً، اشرح السبب أو الأسباب المحتملة ببساطة، ثم وجّه العميل إلى خطوة آمنة أو سؤال تشخيصي مناسب. ميّز بين ما يمكن فحصه بأمان وما يحتاج فنيّاً أو معاينة. لا تحوّل أمثلة مثل لمبة خربانة أو شورت أو مكيف لا يبرد إلى ردود ثابتة؛ افهم التفاصيل المتاحة وأجب بما يناسبها. لا تحصر المعرفة في خدمات الموقع، ثم اقترح خدمة الموقع فقط إذا احتاج العميل تنفيذاً أو زيارة.

كن مختصراً: جملة إلى ثلاث جمل مكتملة وواضحة، ولا تُرسل كلمة مفردة أو جملة مبتورة. لا تبدأ بتحية روتينية في كل رسالة؛ حيِّ العميل في بداية المحادثة فقط. ابدأ بالجواب مباشرة، واسأل سؤالاً واحداً فقط عند الحاجة إلى معلومة ضرورية. لا تقدّم تعليمات خطرة للكهرباء أو الغاز أو الضغط.

في التسعير استخدم سوق مكة المكرمة مرجعاً داخلياً للحد المقبول، وأعطِ العميل السعر بالريال مباشرة من دون ذكر اسم مدينة أو «سعر السوق». اجمع خدمات الطلب المركب عند سؤال «بكم». في الحجز اجمع الخدمة ثم الحي ثم الموعد ثم الاسم والرقم، خطوة واحدة في كل رسالة. لا تكرر ما قاله العميل ولا تخترع معلومات.`;
}

export function normalizeConversationHistory(history: ChatHistoryItem[] | undefined) {
  return (history ?? [])
    .filter(item => item.content.trim().length > 0)
    .slice(-8)
    .map(item => ({ ...item, content: item.content.trim().slice(-500) }));
}

export function sanitizeClientReply(reply: string) {
  const cleanedReply = reply
    .replace(/\*{1,3}\s*draft\s*\d*\s*[:：-]?\s*\*{0,3}/gi, "")
    .replace(/[`*_#]/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(?:متوسط\s+)?سعر\s+سوق\s+مكة(?:\s+المكرمة)?/gi, "متوسط سعر السوق")
    .replace(/(?:متوسط\s+)?سوق\s+مكة(?:\s+المكرمة)?/gi, "متوسط سعر السوق")
    .replace(/أسعار\s+مكة(?:\s+المكرمة)?/gi, "أسعار السوق")
    .replace(/في\s+مكة(?:\s+المكرمة)?/gi, "ضمن نطاق الخدمة")
    .replace(/مكة\s+المكرمة/gi, "نطاق الخدمة")
    .replace(/مكة/gi, "نطاق الخدمة")
    .trim();

  const wordCount = cleanedReply.split(/\s+/).filter(Boolean).length;
  const replyWithoutFinalPunctuation = cleanedReply.replace(/[.!؟?…]+$/, "").trim();
  const endsWithIncompleteConnector = /(?:\b(?:من|إلى|الى|عن|مع|في|أو|او|و)\s*|\d{1,2}\s*)$/i.test(replyWithoutFinalPunctuation);
  const hasPartialPriceRange = /(?:يصل|تصل|من|إلى|الى)\s+(?:[.،]\s*)?\d{1,2}$/i.test(replyWithoutFinalPunctuation);
  const hasArabicText = /[\u0600-\u06ff]/.test(cleanedReply);
  if (wordCount <= 2 || endsWithIncompleteConnector || hasPartialPriceRange || !hasArabicText) {
    const opening = wordCount <= 2 && hasArabicText
      ? cleanedReply.replace(/[،,:؛.!…\-]+$/, "")
      : "أبشر";
    return `${opening}، وضّح لي طلبك أو مشكلتك وسأعطيك جواباً مباشراً.`;
  }

  return /[.!؟?…]$/.test(cleanedReply) ? cleanedReply : `${cleanedReply}.`;
}
