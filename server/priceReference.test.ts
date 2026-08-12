import { describe, expect, it } from "vitest";
import { buildInternalPriceHint, findInternalPriceReferences, isPriceEnquiry } from "./priceReference";

describe("internal price reference", () => {
  it("finds the approved range for a screen installation price enquiry", () => {
    const references = findInternalPriceReferences("بكم تركيب شاشة 60 بوصة؟");

    expect(references[0]?.price).toBe("50 - 100 ريال");
    expect(buildInternalPriceHint(references, true)).toContain("50 - 100 ريال");
    expect(buildInternalPriceHint(references, true)).not.toContain("ريال ريال");
  });

  it("uses the visitor context for a standalone price question", () => {
    const references = findInternalPriceReferences("بكم؟", [
      { role: "user", content: "أبي أأسس غرفة كهرباء وأركب خلاط مغسلة." },
      { role: "assistant", content: "أبشر." },
    ]);

    expect(references.map(reference => reference.price)).toEqual(expect.arrayContaining(["35 - 50 ريال", "50 - 80 ريال"]));
  });

  it("does not inject pricing data when the visitor is not asking for a price", () => {
    expect(isPriceEnquiry("كيف أثبت شاشة 60 بوصة؟")).toBe(false);
    expect(buildInternalPriceHint([], false)).toBe("");
  });

  it("instructs the assistant not to invent an exact price for an unmatched service", () => {
    expect(buildInternalPriceHint(findInternalPriceReferences("بكم تركيب نظام معقد غير معروف؟"), true)).toContain("لا تخترع رقماً محدداً");
  });
});
