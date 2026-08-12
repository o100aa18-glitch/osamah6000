import { describe, expect, it } from "vitest";
import { getGeminiModelCandidates } from "./_core/llm-gemini";

describe("Gemini model fallback", () => {
  it("keeps the preferred model first and includes reliable fallbacks", () => {
    expect(getGeminiModelCandidates("gemini-3.5-flash-lite")).toEqual([
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash-lite",
    ]);
  });

  it("does not duplicate a fallback that was selected as the preferred model", () => {
    expect(getGeminiModelCandidates("gemini-3.1-flash-lite")).toEqual([
      "gemini-3.1-flash-lite",
      "gemini-3.5-flash-lite",
      "gemini-2.5-flash-lite",
    ]);
  });
});
