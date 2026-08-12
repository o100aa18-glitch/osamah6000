export type BookingChatItem = {
  role: "user" | "assistant";
  content: string;
};

const BOOKING_COMPLETE_REPLY = /(?:تم\s+تأكيد\s+حجزك|حجزك\s+بنجاح|تأكيد\s+الحجز)/i;

export function isBookingCompletionReply(reply: string) {
  return BOOKING_COMPLETE_REPLY.test(reply);
}

export function summarizeBookingMessages(messages: BookingChatItem[]) {
  return messages
    .filter(message => message.role === "user")
    .map(message => message.content.trim())
    .filter(Boolean)
    .slice(-5);
}

export function buildBookingWhatsAppText(summary: string[]) {
  return [
    "طلب خدمة جديد من موقع أسامة البعوي",
    "",
    "ملخص الحجز:",
    ...summary.map(item => `- ${item}`),
    "",
    "تم إرسال الطلب من خلال مساعد الموقع.",
  ].join("\n");
}
