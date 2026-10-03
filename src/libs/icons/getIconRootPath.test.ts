import { describe, expect, it } from "vitest";
import { getIconRootPath } from "./getIconRootPath";

describe("getIconRootPath", () => {
  it.each([
    [undefined, "/icons"],
    ["/", "/icons"],
    ["portal", "/portal/icons"],
    ["/portal/", "/portal/icons"],
  ])("maps %s to %s", (rootPath, expected) => {
    expect(getIconRootPath(rootPath)).toBe(expected);
  });
});
