import { describe, expect, it } from "vitest";
import { buildChatSystemPrompt, normalizeConversationHistory, sanitizeClientReply } from "./chatAssistant";

describe("natural service assistant guidance", () => {
  it("keeps Makkah market as the pricing reference without restricting normal conversation", () => {
    const prompt = buildChatSystemPrompt();

    expect(prompt).toContain("استخدم سوق مكة المكرمة مرجعاً داخلياً للحد المقبول");
    expect(prompt).toContain("لا تحوّل أمثلة مثل لمبة خربانة أو شورت أو مكيف لا يبرد إلى ردود ثابتة");
    expect(prompt).toContain("لا تبدأ بتحية روتينية في كل رسالة");
    expect(prompt).toContain("لا تُرسل كلمة مفردة أو جملة مبتورة");
    expect(prompt).toContain("جملة إلى ثلاث جمل مكتملة وواضحة");
    expect(prompt).not.toContain("رد قصير (جملة أو جملتين فقط)");
  });

  it("keeps the Makkah benchmark private in client-facing text", () => {
    const sanitized = sanitizeClientReply("متوسط سعر سوق مكة المكرمة مناسب، والعمل متاح في مكة.");

    expect(sanitized).toContain("متوسط سعر السوق");
    expect(sanitized).toContain("ضمن نطاق الخدمة");
    expect(sanitized).not.toContain("مكة");
  });

  it("keeps only the recent context while preventing an overlong prompt", () => {
    const history = Array.from({ length: 20 }, (_, index) => ({
      role: index % 2 === 0 ? "user" as const : "assistant" as const,
      content: `رسالة ${index}`,
    }));

    const normalized = normalizeConversationHistory(history);
    expect(normalized).toHaveLength(8);
    expect(normalized[0]?.content).toBe("رسالة 12");
  });

  it("turns a one-word reply into a complete short response", () => {
    expect(sanitizeClientReply("يسعدك")).toBe("يسعدك، وضّح لي طلبك أو مشكلتك وسأعطيك جواباً مباشراً.");
  });

  it("removes draft formatting and rejects an incomplete price ending", () => {
    expect(sanitizeClientReply("**Draft 1:** تكلفة الفحص هي 50 ريال."))
      .toBe("تكلفة الفحص هي 50 ريال.");
    const sanitized = sanitizeClientReply("تبدأ تكلفة الإصلاح من 100 ريال وتصل إلى 2.");
    expect(sanitized).toBe("أبشر، وضّح لي طلبك أو مشكلتك وسأعطيك جواباً مباشراً.");
    expect(sanitized).not.toContain("2");
  });
});
