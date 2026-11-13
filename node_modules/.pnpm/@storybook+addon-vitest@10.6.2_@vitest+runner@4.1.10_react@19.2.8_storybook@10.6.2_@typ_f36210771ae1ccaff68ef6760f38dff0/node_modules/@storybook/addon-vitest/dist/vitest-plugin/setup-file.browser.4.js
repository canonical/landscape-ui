import {
  isFunction
} from "../_browser-chunks/chunk-O7QECQMH.js";

// src/vitest-plugin/setup-file.browser.4.ts
import { beforeEach } from "vitest";
import { commands } from "vitest/browser";
var resetMousePositionBeforeTests = async () => {
  "resetMousePosition" in commands && isFunction(commands.resetMousePosition) && await commands.resetMousePosition();
};
beforeEach(async () => {
  await resetMousePositionBeforeTests();
});
export {
  resetMousePositionBeforeTests
};
