import { describe, expect, it } from "vitest";
import { buildBookingWhatsAppText, isBookingCompletionReply, summarizeBookingMessages } from "./bookingWhatsApp";

describe("booking WhatsApp summary", () => {
  it("appears only when the existing booking flow confirms completion", () => {
    expect(isBookingCompletionReply("تم تأكيد حجزك بنجاح، وسيتواصل معك الفني.")).toBe(true);
    expect(isBookingCompletionReply("أي حي مناسب لك؟")).toBe(false);
  });

  it("creates a WhatsApp-ready summary from existing customer messages only", () => {
    const summary = summarizeBookingMessages([
      { role: "user", content: "أبي أحجز تركيب خلاط مغسلة" },
      { role: "assistant", content: "أي حي؟" },
      { role: "user", content: "حي الصفا غداً مساء" },
      { role: "user", content: "أسامة" },
      { role: "user", content: "0550309736" },
    ]);

    expect(buildBookingWhatsAppText(summary)).toContain("حي الصفا غداً مساء");
    expect(buildBookingWhatsAppText(summary)).toContain("0550309736");
  });
});
