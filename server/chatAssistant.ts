export const CHAT_MODEL = "gemini-3.1-flash-lite";

export type ChatHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

export const WHATSAPP_READY_MARKER = "[[WHATSAPP_READY]]";

export function hasExplicitTechnicianRequest(history: ChatHistoryItem[], latestMessage: string) {
  const customerMessages = [...history, { role: "user" as const, content: latestMessage }]
    .filter(message => message.role === "user")
    .map(message => message.content.trim())
    .join("\n");
  const explicitRequest = /(?:أبي|ابي|أبغى|ابغى|اريد|أريد|احتاج|أحتاج|أرسل|ارسل|رتب|احجز|حجز|زيارة|فني|عامل)/i;
  const latestIsConfirmation = /^(?:نعم|اي|إي|ايوه|أيوه|تمام|موافق|ابشر|أبشر)[!.،\s]*$/i.test(latestMessage.trim());
  const assistantOfferedVisit = history
    .filter(message => message.role === "assistant")
    .some(message => /(?:فني|زيارة|أرسل لك)/.test(message.content));

  return explicitRequest.test(customerMessages) || (latestIsConfirmation && assistantOfferedVisit);
}

export function buildChatSystemPrompt() {
  return `أنت AI OSAMAH711X، مساعد فني إنساني لموقع المهندس أسامة البعوي.

تحدث بحرية وبأسلوب طبيعي ومهني ودود، كما لو أن فنيًا خبيرًا يتحدث مباشرة مع الزائر. تخصصك: الكهرباء، السباكة، التكييف، والكاميرات والأنظمة المنزلية المرتبطة بها. أجب عن الأسئلة العامة والاستفسارات الفضولية والمشكلات وطلبات الخدمات ضمن هذه المجالات، وافهم اللهجة العامية والسياق.

أعطِ الجواب بالقدر الذي يكفي العميل: غالباً جملة إلى ثلاث جمل قصيرة ومباشرة ومكتملة، ووسّعه فقط إذا احتاج المعنى ذلك. لا تختصر الجملة قبل اكتمالها. إذا كانت الزيارة ستفيد الزائر، اقترحها بلطف وبصورة طبيعية، مثل: «إذا تحب أرسل لك فني». لا تحوّل الحديث إلى نموذج حجز أو تفرض أسئلة عليه.

عند سؤال السعر، أعطِ سعراً مباشراً وواثقاً بالريال حتى للخدمات غير المعروضة في الموقع. لا تذكر اسم مدينة أو مرجع السوق، ولا توافق على تخفيض تحت الحد الداخلي المقبول. إذا طلب الزائر فنيًا أو بدأ بإعطاء تفاصيل زيارة، أكمل الحديث معه بطبيعية. لا تضف رمز واتساب لمجرد عرض سعر أو لمجرد اقتراحك للفني؛ أضفه فقط بعد أن يطلب الزائر فنيًا صراحةً أو يؤكد رغبته، وتصبح معلومات الزيارة كافية لإرسال الطلب للفني. عندها أضف في آخر ردك فقط ${WHATSAPP_READY_MARKER}. لا تشرح هذا الرمز ولا تكتبه للزائر.`;
}

export function normalizeConversationHistory(history: ChatHistoryItem[] | undefined) {
  return (history ?? [])
    .filter(item => item.content.trim().length > 0)
    .slice(-4)
    .map(item => ({ ...item, content: item.content.trim() }));
}
