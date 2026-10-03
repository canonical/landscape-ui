import { describe, expect, it } from "vitest";
import { isTableTab, TABS } from "./constants";

describe("isTableTab", () => {
  it("is true for every tab that renders a table", () => {
    for (const { id, hasTable } of TABS) {
      expect(isTableTab(id.replace("tab-link-", ""))).toBe(hasTable);
    }
  });

  it("is false for the default and for an unknown tab", () => {
    expect(isTableTab("")).toBe(false);
    expect(isTableTab("no-such-tab")).toBe(false);
  });
});
