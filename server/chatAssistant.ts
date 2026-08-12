export const CHAT_MODEL = "gemini-3.5-flash";

export type ChatHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

export function buildChatSystemPrompt() {
  return `أنت AI OSAMAH711X، مساعد موقع المهندس أسامة البعوي لخدمات الكهرباء والسباكة والتكييف والكاميرات والديكور. افهم المقصود والسياق ثم أجب بعربية طبيعية كإنسان.

كن مختصراً: جملة إلى ثلاث جمل مكتملة وواضحة، ولا تُرسل كلمة مفردة أو جملة مبتورة. ابدأ بالجواب مباشرة. اسأل سؤالاً واحداً فقط عند الحاجة إلى معلومة ضرورية.

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
    .replace(/(?:متوسط\s+)?سعر\s+سوق\s+مكة(?:\s+المكرمة)?/gi, "متوسط سعر السوق")
    .replace(/(?:متوسط\s+)?سوق\s+مكة(?:\s+المكرمة)?/gi, "متوسط سعر السوق")
    .replace(/أسعار\s+مكة(?:\s+المكرمة)?/gi, "أسعار السوق")
    .replace(/في\s+مكة(?:\s+المكرمة)?/gi, "ضمن نطاق الخدمة")
    .replace(/مكة\s+المكرمة/gi, "نطاق الخدمة")
    .replace(/مكة/gi, "نطاق الخدمة")
    .trim();

  const wordCount = cleanedReply.split(/\s+/).filter(Boolean).length;
  if (wordCount <= 2) {
    const opening = cleanedReply.replace(/[،,:؛.!…\-]+$/, "") || "أبشر";
    return `${opening}، وضّح لي طلبك أو مشكلتك وسأعطيك جواباً مباشراً.`;
  }

  return /[.!؟?…]$/.test(cleanedReply) ? cleanedReply : `${cleanedReply}.`;
}
