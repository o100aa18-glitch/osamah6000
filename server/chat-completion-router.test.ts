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

  it("does not expose a draft label or incomplete price from a model reply", async () => {
    invokeGeminiMock.mockResolvedValue({
      choices: [{ message: { content: "**Draft 1:** تبدأ التكلفة من 100 ريال وتصل إلى 2." } }],
    });
    const caller = appRouter.createCaller({ req: {}, res: {}, user: null } as any);
    const result = await caller.chat.sendMessage({ message: "أحتاج مساعدة", conversationHistory: [] });

    expect(result.reply).toBe("أبشر، وضّح لي طلبك أو مشكلتك وسأعطيك جواباً مباشراً.");
    expect(result.reply).not.toMatch(/Draft|\*|\b2\b/);
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
});
