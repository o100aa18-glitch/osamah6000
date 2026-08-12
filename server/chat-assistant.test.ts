import { describe, expect, it } from "vitest";
import { buildChatSystemPrompt, normalizeConversationHistory, sanitizeClientReply } from "./chatAssistant";

describe("natural service assistant guidance", () => {
  it("keeps the pricing reference private without restricting normal conversation", () => {
    const prompt = buildChatSystemPrompt();

    expect(prompt).toContain("لا تتصرف كنموذج حجز أو قائمة خدمات");
    expect(prompt).toContain("أجب بحرية عن الاستفسارات العامة والفضول الفني والأعطال وطلبات الخدمات");
    expect(prompt).toContain("لا تفرض مساراً أو أسئلة ثابتة");
    expect(prompt).toContain("لا توافق على سعر أدنى عند التفاوض");
  });

  it("keeps the Makkah benchmark private in client-facing text", () => {
    const sanitized = sanitizeClientReply("متوسط سعر سوق مكة المكرمة مناسب، والعمل متاح في مكة.");

    expect(sanitized).toContain("السعر");
    expect(sanitized).toContain("ضمن نطاق الخدمة");
    expect(sanitized).not.toContain("مكة");
  });

  it("keeps only the recent context while preventing an overlong prompt", () => {
    const history = Array.from({ length: 20 }, (_, index) => ({
      role: index % 2 === 0 ? "user" as const : "assistant" as const,
      content: `رسالة ${index}`,
    }));

    const normalized = normalizeConversationHistory(history);
    expect(normalized).toHaveLength(4);
    expect(normalized[0]?.content).toBe("رسالة 16");
  });

  it("keeps a natural short reply instead of replacing it with a canned answer", () => {
    expect(sanitizeClientReply("يسعدك")).toBe("يسعدك");
  });

  it("removes draft formatting without replacing Gemini text with a canned response", () => {
    expect(sanitizeClientReply("**Draft 1:** تكلفة الفحص هي 50 ريال."))
      .toBe("تكلفة الفحص هي 50 ريال.");
    const sanitized = sanitizeClientReply("تبدأ تكلفة الإصلاح من 100 ريال وتصل إلى 2.");
    expect(sanitized).toBe("تبدأ تكلفة الإصلاح من 100 ريال وتصل إلى 2.");
  });

  it("does not replace a model reply with a generic clarification prompt", () => {
    const sanitized = sanitizeClientReply("الشورت الكهربائي يحدث عادة بسبب تلامس الأسلاك أو وجود جهاز ت");

    expect(sanitized).toBe("الشورت الكهربائي يحدث عادة بسبب تلامس الأسلاك أو وجود جهاز ت");
  });
});
