import { beforeEach, describe, expect, it, vi } from "vitest";

const { invokeGeminiMock } = vi.hoisted(() => ({
  invokeGeminiMock: vi.fn(),
}));

vi.mock("./_core/llm-gemini", () => ({
  invokeGemini: invokeGeminiMock,
}));

import { appRouter } from "./routers";

describe("chat completion guard", () => {
  beforeEach(() => {
    invokeGeminiMock.mockReset();
  });

  it("does not expose a draft label or replace a model reply with canned wording", async () => {
    invokeGeminiMock.mockResolvedValue({
      choices: [{ message: { content: "**Draft 1:** تبدأ التكلفة من 100 ريال وتصل إلى 2." } }],
    });
    const caller = appRouter.createCaller({ req: {}, res: {}, user: null } as any);
    const result = await caller.chat.sendMessage({ message: "أحتاج مساعدة", conversationHistory: [] });

    expect(result.reply).toBe("تبدأ التكلفة من 100 ريال وتصل إلى 2.");
    expect(result.reply).not.toMatch(/Draft|\*/);
  });

  it("sends an ordinary technical description to the flexible professional assistant", async () => {
    invokeGeminiMock.mockResolvedValue({
      choices: [{ message: { content: "قد يكون الخلل من اللمبة أو القاعدة. جرّب لمبة سليمة أولاً، وإذا استمر العطل يحتاج فحص التوصيلات." } }],
    });
    const caller = appRouter.createCaller({ req: {}, res: {}, user: null } as any);
    const result = await caller.chat.sendMessage({ message: "عندي لمبة خربانة", conversationHistory: [] });

    expect(invokeGeminiMock).toHaveBeenCalledOnce();
    expect(result.reply).toBe("قد يكون الخلل من اللمبة أو القاعدة. جرّب لمبة سليمة أولاً، وإذا استمر العطل يحتاج فحص التوصيلات.");
  });

  it("lets Gemini control the conversation and exposes WhatsApp only through its hidden readiness signal", async () => {
    invokeGeminiMock.mockResolvedValue({
      choices: [{ message: { content: "تم تجهيز طلبك للفني. [[WHATSAPP_READY]]" } }],
    });
    const caller = appRouter.createCaller({ req: {}, res: {}, user: null } as any);
    const result = await caller.chat.sendMessage({ message: "أبي فني", conversationHistory: [] });

    expect(invokeGeminiMock).toHaveBeenCalledOnce();
    expect(result.bookingReady).toBe(true);
    expect(result.reply).not.toContain("WHATSAPP_READY");
  });

  it("keeps a useful model reply without post-processing it into a generic response", async () => {
    invokeGeminiMock.mockResolvedValue({
      choices: [{ message: { content: "افصل القاطع عن الدائرة المتضررة، ثم يحتاج الأمر فحصاً آمناً من فني." } }],
      finishReason: "MAX_TOKENS",
    });
    const caller = appRouter.createCaller({ req: {}, res: {}, user: null } as any);
    const result = await caller.chat.sendMessage({ message: "عندي شورت", conversationHistory: [] });

    expect(result.reply).toContain("افصل القاطع");
    expect(result.reply).not.toContain("لم تكتمل التفاصيل لدي");
  });
});
