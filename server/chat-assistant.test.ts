import { describe, expect, it } from "vitest";
import { buildChatSystemPrompt, hasExplicitTechnicianRequest, normalizeConversationHistory } from "./chatAssistant";

describe("clean Gemini chat path", () => {
  it("uses one concise assistant identity without a fixed booking or pricing flow", () => {
    const prompt = buildChatSystemPrompt();

    expect(prompt).toContain("مساعد فني إنساني");
    expect(prompt).toContain("لا تحوّل الحديث إلى نموذج حجز");
    expect(prompt).toContain("إذا تحب أرسل لك فني");
    expect(prompt).toContain("لا توافق على تخفيض تحت الحد الداخلي المقبول");
  });

  it("includes an internal price hint without naming its market reference", () => {
    const prompt = buildChatSystemPrompt("معلومة سعر داخلية غير ظاهرة للعميل: نطاق 50 - 100 ريال.");

    expect(prompt).toContain("نطاق 50 - 100 ريال");
    expect(prompt).toContain("السعر النهائي يحدده الفني المختص");
  });

  it("keeps only the last four complete conversation messages", () => {
    const history = Array.from({ length: 6 }, (_, index) => ({
      role: index % 2 === 0 ? "user" as const : "assistant" as const,
      content: `رسالة ${index}`,
    }));

    const normalized = normalizeConversationHistory(history);
    expect(normalized).toHaveLength(4);
    expect(normalized[0]?.content).toBe("رسالة 2");
  });

  it("does not treat a price enquiry as a technician request", () => {
    expect(hasExplicitTechnicianRequest([], "بكم تركيب شاشة 60 بوصة؟")).toBe(false);
  });

  it("accepts an explicit technician request or confirmation after an offer", () => {
    expect(hasExplicitTechnicianRequest([], "أرسل لي فني لتركيب الشاشة")).toBe(true);
    expect(hasExplicitTechnicianRequest([
      { role: "assistant", content: "إذا تحب أرسل لك فني." },
    ], "تمام")).toBe(true);
  });
});
