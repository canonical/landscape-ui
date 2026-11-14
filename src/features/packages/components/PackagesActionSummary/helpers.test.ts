import { describe, expect, it } from "vitest";
import {
  getActionSubmitButtonAppearance,
  getActionSubmitButtonText,
} from "./helpers";

describe("package action submit buttons", () => {
  it.each([
    ["install", "Install", "positive"],
    ["remove", "Uninstall", "negative"],
    ["hold", "Hold", "positive"],
    ["unhold", "Unhold", "positive"],
    ["change_version", "Change version on", "positive"],
  ] as const)(
    "uses the correct label and appearance for %s",
    (action, text, appearance) => {
      expect(getActionSubmitButtonText(action)).toBe(text);
      expect(getActionSubmitButtonAppearance(action)).toBe(appearance);
    },
  );
});
