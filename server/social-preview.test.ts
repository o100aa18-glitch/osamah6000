import { describe, expect, it } from "vitest";
import { injectSocialMetadata, getSocialOrigin } from "./socialPreview";
import { siteMetadata, siteShareVersion } from "@shared/siteMetadata";

describe("dynamic social preview", () => {
  it("uses the current request origin, including a www domain", () => {
    expect(
      getSocialOrigin({
        headers: { host: "www.osamah711x.com", "x-forwarded-proto": "https" },
      }),
    ).toBe("https://www.osamah711x.com");
  });

  it("injects an origin-specific preview URL with a content version", () => {
    const template = "{{SOCIAL_ORIGIN}}/social-preview.png?v={{SOCIAL_PREVIEW_VERSION}}";
    const output = injectSocialMetadata(template, {
      headers: { host: "osamah711x.com", "x-forwarded-proto": "https" },
    });

    expect(output).toBe(`https://osamah711x.com/social-preview.png?v=${siteShareVersion}`);
    expect(siteMetadata.profileImageUrl).toContain("files.manuscdn.com");
  });
});
