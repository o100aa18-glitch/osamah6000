import { beforeEach, describe, expect, it, vi } from "vitest";

const { invokeGeminiMock } = vi.hoisted(() => ({
  invokeGeminiMock: vi.fn(),
}));

vi.mock("./_core/llm-gemini", () => ({
  invokeGemini: invokeGeminiMock,
}));

import { appRouter } from "./routers";

function createChatCaller() {
  return appRouter.createCaller({
    req: {},
    res: {},
    user: null,
  } as any);
}

describe("chat message context", () => {
  beforeEach(() => {
    invokeGeminiMock.mockReset();
  });

  it("uses the new shower mixer meaning instead of repeating the basin mixer", async () => {
    const caller = createChatCaller();
    const result = await caller.chat.sendMessage({
      message: "وخلاط دش",
      conversationHistory: [
        { role: "user", content: "تركيب خلاط مغسلة" },
        { role: "assistant", content: "تركيب خلاط مغسلة: 65 ريال." },
      ],
    });

    expect(result.reply).toBe("تركيب خلاط دش: 65 ريال.");
    expect(invokeGeminiMock).not.toHaveBeenCalled();
  });

  it("answers a short price objection as a complete negotiation reply", async () => {
    const caller = createChatCaller();
    const result = await caller.chat.sendMessage({
      message: "السعر غالي",
      conversationHistory: [
        { role: "user", content: "وخلاط دش" },
        { role: "assistant", content: "تركيب خلاط دش: 65 ريال." },
      ],
    });

    expect(result.reply).toBe("أبشر، إذا الخلاط جاهز والتركيب عادي أقدر أرتبه لك بـ55 ريال. يناسبك؟");
    expect(invokeGeminiMock).not.toHaveBeenCalled();
  });

  it("turns an incomplete model lead-in into a complete standalone answer", async () => {
    invokeGeminiMock.mockResolvedValue({
      choices: [{ message: { content: "عشان يحتاج فحص بسيط قبل تحديد الحل،" } }],
    });
    const caller = createChatCaller();
    const result = await caller.chat.sendMessage({
      message: "ليش المكيف يطفي؟",
      conversationHistory: [],
    });

    expect(result.reply).toBe("السبب أنه يحتاج فحص بسيط قبل تحديد الحل.");
  });
});
