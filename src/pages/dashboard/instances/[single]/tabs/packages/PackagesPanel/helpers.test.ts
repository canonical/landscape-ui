import { describe, expect, it } from "vitest";
import { getEmptyMessage } from "./helpers";

describe("PackagesPanel helpers", () => {
  it("returns empty-state messages by package filter", () => {
    expect(getEmptyMessage("", "")).toBe("No packages found.");
    expect(getEmptyMessage("upgrade", "")).toBe("No available upgrades found.");
    expect(getEmptyMessage("security", "")).toBe(
      "No available security upgrades found.",
    );
    expect(getEmptyMessage("installed", "")).toBe(
      "No installed packages found.",
    );
    expect(getEmptyMessage("held", "")).toBe("No held packages found.");
  });

  it("appends package search term when provided", () => {
    expect(getEmptyMessage("upgrade", "openssl")).toBe(
      'No available upgrades found with the search "openssl".',
    );
  });
});
