import { describe, expect, it } from "vitest";
import { buildBookingReply, extractCompletedBookingDetails } from "./bookingAssistant";

describe("short booking guidance", () => {
  it("asks only for the next missing booking detail", () => {
    const reply = buildBookingReply([], "أبي أحجز تركيب خلاط مغسلة");
    expect(reply).toBe("تمام، طلبك: تركيب خلاط مغسلة. أي حي مناسب لك؟");
  });

  it("continues the booking from conversation history", () => {
    const reply = buildBookingReply(
      [{ role: "user", content: "أبي أحجز تركيب خلاط مغسلة" }, { role: "assistant", content: "أي حي مناسب لك؟" }],
      "حي الصفا اليوم مساء",
    );
    expect(reply).toContain("تم تسجيل طلبك: تركيب خلاط مغسلة");
    expect(reply).toContain("حي الصفا");
    expect(reply).toContain("اليوم");
    expect(reply).toContain("أرسل اسمك ورقمك للتأكيد");
  });

  it("extracts a complete booking only after the customer confirms name and phone", () => {
    const history = [
      { role: "user" as const, content: "أبي أحجز تركيب خلاط مغسلة" },
      { role: "assistant" as const, content: "أي حي مناسب لك؟" },
      { role: "user" as const, content: "حي الصفا غداً مساء" },
      { role: "assistant" as const, content: "أرسل اسمك ورقمك للتأكيد." },
      { role: "user" as const, content: "أسامة" },
      { role: "assistant" as const, content: "أرسل رقم جوالك." },
    ];

    expect(extractCompletedBookingDetails(history, "0550309736")).toEqual({
      serviceSummary: "تركيب خلاط مغسلة",
      requestDescription: "أبي أحجز تركيب خلاط مغسلة",
      area: "حي الصفا",
      appointmentText: "غداً مساء",
      customerName: "أسامة",
      customerPhone: "0550309736",
    });
  });
});
