import { describe, expect, it } from "vitest";
import { serviceCatalog } from "./serviceCatalog";

describe("service catalog for the assistant", () => {
  it("covers the site service categories with market price data", () => {
    expect(serviceCatalog.length).toBeGreaterThanOrEqual(90);
    expect(serviceCatalog.some(service => service.id === "e33")).toBe(true);
    expect(serviceCatalog.some(service => service.id === "p19")).toBe(true);
    expect(serviceCatalog.some(service => service.id === "ac3")).toBe(true);
    expect(serviceCatalog.some(service => service.id === "cam6")).toBe(true);
    expect(serviceCatalog.some(service => service.id === "dec3")).toBe(true);
  });
});
