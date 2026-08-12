import { beforeEach, describe, expect, it, vi } from "vitest";

const { invokeGeminiMock } = vi.hoisted(() => ({
  invokeGeminiMock: vi.fn(),
}));

vi.mock("./_core/llm-gemini", () => ({
  invokeGemini: invokeGeminiMock,
}));

import { appRouter } from "./routers";

function createCaller() {
  return appRouter.createCaller({ req: {}, res: {}, user: null } as any);
}

describe("free website assistant conversation", () => {
  beforeEach(() => {
    invokeGeminiMock.mockReset();
  });

  it("lets Gemini answer a service price instead of short-circuiting to catalog rules", async () => {
    invokeGeminiMock.mockResolvedValue({
      choices: [{ message: { content: "تركيب الفيش العادي غالباً بين 15 و25 ريال إذا كانت النقطة جاهزة." } }],
    });
    const result = await createCaller().chat.sendMessage({ message: "بكم تركيب الفيش؟", conversationHistory: [] });

    expect(invokeGeminiMock).toHaveBeenCalledOnce();
    expect(result.reply).toContain("15 و25 ريال");
  });

  it("keeps booking inside the free conversation and enables WhatsApp only when Gemini marks it ready", async () => {
    invokeGeminiMock
      .mockResolvedValueOnce({ choices: [{ message: { content: "أكيد، أقدر أرتب لك فني. أي حي يناسبك؟" } }] })
      .mockResolvedValueOnce({ choices: [{ message: { content: "ممتاز، وما الوقت المناسب للزيارة؟" } }] })
      .mockResolvedValueOnce({ choices: [{ message: { content: "تم تجهيز طلبك للفني. [[WHATSAPP_READY]]" } }] });
    const caller = createCaller();
    const initial = await caller.chat.sendMessage({ message: "أبي فني يركب خلاط", conversationHistory: [] });
    const area = await caller.chat.sendMessage({
      message: "حي الصفا",
      conversationHistory: [{ role: "user", content: "أبي فني يركب خلاط" }, { role: "assistant", content: initial.reply }],
    });
    const complete = await caller.chat.sendMessage({
      message: "غداً مساء، اسمي أسامة ورقمي 0550309736",
      conversationHistory: [
        { role: "user", content: "أبي فني يركب خلاط" },
        { role: "assistant", content: initial.reply },
        { role: "user", content: "حي الصفا" },
        { role: "assistant", content: area.reply },
      ],
    });

    expect(initial.reply).toContain("أي حي يناسبك؟");
    expect(area.reply).toContain("الوقت المناسب");
    expect(complete.bookingReady).toBe(true);
    expect(complete.reply).not.toContain("WHATSAPP_READY");
  });
});
