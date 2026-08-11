import { describe, expect, it } from "vitest";
import { buildBookingReply } from "./bookingAssistant";

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
});
