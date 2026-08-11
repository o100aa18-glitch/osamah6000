import { describe, expect, it } from "vitest";
import { buildCompositePricingReply, getRequestedPricedServices } from "./compositeOrderPricing";

describe("composite service order pricing", () => {
  const history = [{
    role: "user" as const,
    content: "أبي أسس غرفة كهرباء وأركب خلاط مغسلة",
  }];

  it("finds every requested service rather than only the final item", () => {
    const services = getRequestedPricedServices(history, "بكم");
    expect(services.map(service => service.id)).toEqual(expect.arrayContaining(["e33", "p19"]));
  });

  it("answers a short price question with direct prices for all recognised items", () => {
    const reply = buildCompositePricingReply(history, "بكم");
    expect(reply).toContain("تأسيس كهرباء الغرفة");
    expect(reply).toContain("تركيب خلاط مغسلة");
    expect(reply).toContain("45 ريال للنقطة");
    expect(reply).toContain("65 ريال");
    expect(reply).toContain("كم نقطة تحتاج بالغرفة؟");
    expect(reply).not.toContain("والبنود المحددة");
    expect(reply).not.toContain("سعر السوق");
    expect(reply).not.toContain("مكة");
    expect(reply!.length).toBeLessThan(180);
  });

  it("calculates the final total when the client supplies the missing quantity", () => {
    const reply = buildCompositePricingReply(
      [...history, { role: "assistant", content: "كم نقطة تحتاج بالغرفة؟" }],
      "4 نقاط",
    );

    expect(reply).toContain("تأسيس كهرباء الغرفة: 180 ريال (4 نقاط)");
    expect(reply).toContain("تركيب خلاط مغسلة: 65 ريال");
    expect(reply).toContain("الإجمالي: 245 ريال");
  });
});
