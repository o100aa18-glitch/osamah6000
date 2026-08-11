import { describe, expect, it } from "vitest";
import { getGeminiModelCandidates } from "./_core/llm-gemini";

describe("Gemini model fallback", () => {
  it("keeps the preferred model first and includes reliable fallbacks", () => {
    expect(getGeminiModelCandidates("gemini-3.5-flash")).toEqual([
      "gemini-3.5-flash",
      "gemini-2.5-flash",
      "gemini-flash-latest",
    ]);
  });

  it("does not duplicate a fallback that was selected as the preferred model", () => {
    expect(getGeminiModelCandidates("gemini-2.5-flash")).toEqual([
      "gemini-2.5-flash",
      "gemini-flash-latest",
    ]);
  });
});
