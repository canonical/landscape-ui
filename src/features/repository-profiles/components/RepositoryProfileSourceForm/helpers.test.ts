import { describe, expect, it } from "vitest";
import { isValidDebLine } from "./helpers";

describe("isValidDebLine", () => {
  it.each([
    "deb http://example.com/ubuntu focal main",
    "deb-src https://example.com/ubuntu focal main universe",
    "deb [arch=amd64 signed-by=/k.gpg] https://example.com/ubuntu focal main",
    "deb http://example.com/repo ./",
    "deb http://example.com/ubuntu focal main # comment",
  ])("accepts %s", (line) => {
    expect(isValidDebLine(line)).toBe(true);
  });

  it.each([
    "deb",
    "deb garbage",
    "deb http://example.com/ubuntu",
    "deb [arch=amd64] http://example.com/ubuntu",
    "rpm http://example.com/ubuntu focal main",
    "debhttp://example.com/ubuntu focal main",
  ])("rejects %s", (line) => {
    expect(isValidDebLine(line)).toBe(false);
  });
});
