import { describe, expect, it } from "vitest";
import { isMissingSource } from "./helpers";

describe("isMissingSource", () => {
  it("returns true for unreachable mirror sources", () => {
    expect(
      isMissingSource({
        source: "mirrors/non-existent-mirror",
        sourceType: "Mirror",
        unreachableSourceNames: ["mirrors/non-existent-mirror"],
      }),
    ).toBe(true);
  });

  it("returns true for unreachable local repository sources", () => {
    expect(
      isMissingSource({
        source: "locals/non-existent-local",
        sourceType: "Local repository",
        unreachableSourceNames: ["locals/non-existent-local"],
      }),
    ).toBe(true);
  });

  it("returns false for unknown source types", () => {
    expect(
      isMissingSource({
        source: "ppa/some-ppa",
        sourceType: "Unknown",
        unreachableSourceNames: ["ppa/some-ppa"],
      }),
    ).toBe(false);
  });
});
