import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { isBookingCompletionReply } from "../client/src/lib/bookingWhatsApp";

function createCaller() {
  return appRouter.createCaller({ req: {}, res: {}, user: null } as any);
}

describe("website assistant booking flow", () => {
  it("answers a common service name with a direct reference price", async () => {
    const caller = createCaller();
    const result = await caller.chat.sendMessage({ message: "بكم تركيب الفيش؟", conversationHistory: [] });

    expect(result.reply).toContain("تركيب مفتاح أو فيش عادي");
    expect(result.reply).toContain("20 ريال");
    expect(result.reply).not.toContain("مكة");
  });

  it("keeps the booking conversation in chat and exposes WhatsApp only after confirmation", async () => {
    const caller = createCaller();
    const initial = await caller.chat.sendMessage({ message: "أبي أحجز تركيب خلاط مغسلة", conversationHistory: [] });
    expect(initial.reply).toContain("أي حي مناسب لك؟");
    expect(isBookingCompletionReply(initial.reply)).toBe(false);

    const areaAndTime = await caller.chat.sendMessage({
      message: "حي الصفا غداً مساء",
      conversationHistory: [
        { role: "user", content: "أبي أحجز تركيب خلاط مغسلة" },
        { role: "assistant", content: initial.reply },
      ],
    });
    expect(areaAndTime.reply).toContain("أرسل اسمك ورقمك للتأكيد");
    expect(isBookingCompletionReply(areaAndTime.reply)).toBe(false);

    const complete = await caller.chat.sendMessage({
      message: "أسامة 0550309736",
      conversationHistory: [
        { role: "user", content: "أبي أحجز تركيب خلاط مغسلة" },
        { role: "assistant", content: initial.reply },
        { role: "user", content: "حي الصفا غداً مساء" },
        { role: "assistant", content: areaAndTime.reply },
      ],
    });
    expect(complete.reply).toContain("تم تأكيد حجزك");
    expect(complete.reply).toContain("واتساب");
    expect(isBookingCompletionReply(complete.reply)).toBe(true);
  });
});
