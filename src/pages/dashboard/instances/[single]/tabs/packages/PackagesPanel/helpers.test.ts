import { describe, expect, it } from "vitest";
import { getEmptyMessage, getPackageSearchFilters } from "./helpers";

describe("getPackageSearchFilters", () => {
  it("requests installed packages for the All filter", () => {
    expect(getPackageSearchFilters("")).toEqual({ installed: true });
  });

  it("requests upgrades for the upgrade filter", () => {
    expect(getPackageSearchFilters("upgrade")).toEqual({ upgrade: true });
  });

  it("requests only security upgrades for the security filter", () => {
    expect(getPackageSearchFilters("security")).toEqual({
      security_upgrades_available: true,
    });
  });

  it("requests held packages for the held filter", () => {
    expect(getPackageSearchFilters("held")).toEqual({ held: true });
  });
});

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
