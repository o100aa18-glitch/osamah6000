import { describe, expect, it } from "vitest";
import { buildChatSystemPrompt, normalizeConversationHistory, sanitizeClientReply } from "./chatAssistant";

describe("natural service assistant guidance", () => {
  it("keeps Makkah market as the pricing reference without restricting normal conversation", () => {
    const prompt = buildChatSystemPrompt();

    expect(prompt).toContain("استخدم سوق مكة المكرمة مرجعاً رقمياً للأسعار");
    expect(prompt).toContain("لا تذكر مكة أو اسم أي مدينة أو «سعر السوق»");
    expect(prompt).toContain("يمكنك التحدث بصورة طبيعية في الأسئلة العامة");
    expect(prompt).toContain("افهمها ضمن المجال الأقرب");
    expect(prompt).toContain("لا تتجاوز 45 كلمة");
    expect(prompt).not.toContain("رد قصير (جملة أو جملتين فقط)");
  });

  it("keeps the Makkah benchmark private in client-facing text", () => {
    const sanitized = sanitizeClientReply("متوسط سعر سوق مكة المكرمة مناسب، والعمل متاح في مكة.");

    expect(sanitized).toContain("متوسط سعر السوق");
    expect(sanitized).toContain("ضمن نطاق الخدمة");
    expect(sanitized).not.toContain("مكة");
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
