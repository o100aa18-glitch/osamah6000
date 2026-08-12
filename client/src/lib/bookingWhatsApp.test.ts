import { describe, expect, it } from "vitest";
import { buildBookingWhatsAppText, summarizeBookingMessages } from "./bookingWhatsApp";

describe("booking WhatsApp summary", () => {
  it("builds a message from the customer's recent details without a fixed booking reply", () => {
    const summary = summarizeBookingMessages([
      { role: "user", content: "أبي فني يركب خلاط" },
      { role: "assistant", content: "أبشر" },
      { role: "user", content: "حي الصفا غداً مساء، اسمي أسامة 0550309736" },
    ]);

    expect(buildBookingWhatsAppText(summary)).toContain("حي الصفا");
    expect(buildBookingWhatsAppText(summary)).toContain("0550309736");
  });
});
