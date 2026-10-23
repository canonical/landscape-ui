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
