import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("site navigation", () => {
  it("keeps a visible navigation bar linked to the main page sections", () => {
    const homePage = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");

    expect(homePage).toContain('aria-label="التنقل الرئيسي"');
    expect(homePage).toContain('href="#home"');
    expect(homePage).toContain('href="#about"');
    expect(homePage).toContain('href="#services"');
    expect(homePage).toContain('href="#contact"');
  });
});
