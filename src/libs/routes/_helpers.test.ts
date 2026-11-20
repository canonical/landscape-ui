import { describe, expect, it } from "vitest";
import { pageParamsManager } from "../pageParamsManager";
import { createRoute } from "./_helpers";

const route = createRoute("/instances");

const parse = (url: string) =>
  pageParamsManager.getParsedParams(
    new URL(url, "http://localhost").searchParams,
  );

describe("createRoute", () => {
  it("serializes array params so every value is parsed back", () => {
    const url = route({ upgrades: ["security-upgrades", "package-upgrades"] });

    expect(parse(url).upgrades).toEqual([
      "security-upgrades",
      "package-upgrades",
    ]);
  });

  it("serializes single-value array params unchanged", () => {
    expect(route({ upgrades: ["security-upgrades"] })).toBe(
      "/instances?upgrades=security-upgrades",
    );
  });

  it("omits empty array params", () => {
    expect(route({ upgrades: [] })).toBe("/instances");
  });
});

describe("createRoute tab slots", () => {
  it("serializes the page tab before slot values in slot order", () => {
    const url = route({
      tabSlots: { upgrades: "packages", activities: "in-progress" },
      tab: "overview",
      search: "x",
    });

    expect(decodeURIComponent(url)).toBe(
      "/instances?tab=overview&tab=activities:in-progress&tab=upgrades:packages&search=x",
    );
    expect(parse(url)).toMatchObject({
      tab: "overview",
      tabSlots: { activities: "in-progress", upgrades: "packages" },
      search: "x",
    });
  });

  it("serializes slot values without a page tab", () => {
    expect(parse(route({ tabSlots: { panel: "code" } })).tabSlots).toEqual({
      panel: "code",
    });
  });

  it("omits empty slot values", () => {
    expect(route({ tabSlots: { panel: "" } })).toBe("/instances");
  });
});
