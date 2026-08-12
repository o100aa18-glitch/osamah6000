import { describe, expect, it } from "vitest";
import { buildTechnicalGuidanceReply } from "./technicalGuidance";

describe("professional technical guidance", () => {
  it("gives a safe, complete response for an electrical danger", () => {
    expect(buildTechnicalGuidanceReply("فيه ريحة حرق وسخونة في المقبس"))
      .toBe("افصل القاطع المتأثر فوراً ولا تلمس السلك أو المقبس. وجود رائحة حرق أو سخونة يحتاج فني كهرباء قبل إعادة التشغيل.");
  });

  it("gives an actionable, safe response for a water leak", () => {
    expect(buildTechnicalGuidanceReply("عندي تسريب ماء تحت المغسلة"))
      .toBe("أغلق محبس الماء القريب وجفف المكان. إذا كان التسريب قرب كهرباء، افصل القاطع أيضاً واطلب فني سباكة.");
  });

  it("leaves an ordinary technical question to the flexible assistant", () => {
    expect(buildTechnicalGuidanceReply("المكيف لا يبرد من فترة"))
      .toBeNull();
  });
});
