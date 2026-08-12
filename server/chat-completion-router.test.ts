import { beforeEach, describe, expect, it, vi } from "vitest";

const { invokeGeminiMock } = vi.hoisted(() => ({ invokeGeminiMock: vi.fn() }));

vi.mock("./_core/llm-gemini", () => ({ invokeGemini: invokeGeminiMock }));

import { appRouter } from "./routers";

describe("Gemini chat gateway", () => {
  beforeEach(() => invokeGeminiMock.mockReset());

  it("returns Gemini wording directly instead of replacing it with a canned prompt", async () => {
    invokeGeminiMock.mockResolvedValue({
      choices: [{ message: { content: "القاطع يفصل غالباً بسبب حمل زائد أو جهاز فيه خلل." } }],
    });
    const caller = appRouter.createCaller({ req: {}, res: {}, user: null } as any);
    const result = await caller.chat.sendMessage({ message: "ليش القاطع يفصل؟", conversationHistory: [] });

    expect(result.reply).toBe("القاطع يفصل غالباً بسبب حمل زائد أو جهاز فيه خلل.");
    expect(result.success).toBe(true);
  });

  it("strips only the invisible WhatsApp signal and leaves the natural reply intact", async () => {
    invokeGeminiMock.mockResolvedValue({
      choices: [{ message: { content: "تم تجهيز طلبك للفني. [[WHATSAPP_READY]]" } }],
    });
    const caller = appRouter.createCaller({ req: {}, res: {}, user: null } as any);
    const result = await caller.chat.sendMessage({ message: "أبي أرسل الطلب", conversationHistory: [] });

    expect(result.bookingReady).toBe(true);
    expect(result.reply).toBe("تم تجهيز طلبك للفني.");
  });
});
