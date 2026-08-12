const ELECTRICAL_DANGER = /(?:تماس|التماس|شرار|شرارة|حريق|احتراق|ريحة\s*حرق|رائحة\s*حرق|سخونة|صعقة|يكهرب|قاطع.*يفصل)/i;
const WATER_LEAK = /(?:تسريب|تهريب|مويه.*تسرب|ماء.*تسرب|ماسورة.*تسرب|صنبور.*يسرب)/i;

export function buildTechnicalGuidanceReply(message: string) {
  const text = message;

  if (ELECTRICAL_DANGER.test(text)) {
    return "افصل القاطع المتأثر فوراً ولا تلمس السلك أو المقبس. وجود رائحة حرق أو سخونة يحتاج فني كهرباء قبل إعادة التشغيل.";
  }

  if (WATER_LEAK.test(text)) {
    return "أغلق محبس الماء القريب وجفف المكان. إذا كان التسريب قرب كهرباء، افصل القاطع أيضاً واطلب فني سباكة.";
  }

  return null;
}
