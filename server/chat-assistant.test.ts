import { describe, expect, it } from "vitest";
import { buildChatSystemPrompt, normalizeConversationHistory } from "./chatAssistant";

describe("natural service assistant guidance", () => {
  it("keeps Makkah market as the pricing reference without restricting normal conversation", () => {
    const prompt = buildChatSystemPrompt();

    expect(prompt).toContain("سوق مكة المكرمة هو المرجع الأساسي للأسعار");
    expect(prompt).toContain("يمكنك التحدث بصورة طبيعية في الأسئلة العامة");
    expect(prompt).toContain("لا تقل إن بياناتها غير متوفرة");
    expect(prompt).not.toContain("رد قصير (جملة أو جملتين فقط)");
  });

  it("preserves recent context while preventing an overlong prompt", () => {
    const history = Array.from({ length: 20 }, (_, index) => ({
      role: index % 2 === 0 ? "user" as const : "assistant" as const,
      content: `رسالة ${index}`,
    }));

    const normalized = normalizeConversationHistory(history);
    expect(normalized).toHaveLength(16);
    expect(normalized[0]?.content).toBe("رسالة 4");
  });
});
