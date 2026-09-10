import { describe, expect, it } from "vitest";
import { getIconRootPath } from "./getIconRootPath";

describe("getIconRootPath", () => {
  it.each([
    [undefined, "/icons"],
    ["/", "/icons"],
    ["new_dashboard", "/new_dashboard/icons"],
    ["/new_dashboard/", "/new_dashboard/icons"],
  ])("maps %s to %s", (rootPath, expected) => {
    expect(getIconRootPath(rootPath)).toBe(expected);
  });
});
