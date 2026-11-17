import {
  PANEL_ID,
  STORYBOOK_TEST_FEATURES_PROVIDE_KEY
} from "../_browser-chunks/chunk-OK2D7F6A.js";

// src/vitest-plugin/setup-file.ts
import { afterEach, beforeAll, beforeEach, inject, vi } from "vitest";
import { Channel } from "storybook/internal/channels";
import { getChannel, setChannel } from "storybook/internal/channels";
var features = inject(STORYBOOK_TEST_FEATURES_PROVIDE_KEY);
features && (vi.stubGlobal("FEATURES", features), beforeEach(() => vi.stubGlobal("FEATURES", features)));
var defaultChannel = null, initTransport = () => {
  let existing = getChannel();
  if (existing) {
    defaultChannel ??= existing;
    return;
  }
  let transport = { setHandler: vi.fn(), send: vi.fn() }, channel = new Channel({ transport });
  defaultChannel = channel, setChannel(channel);
}, restoreDefaultChannel = () => {
  if (!defaultChannel) {
    initTransport();
    return;
  }
  getChannel() !== defaultChannel && setChannel(defaultChannel);
}, modifyErrorMessage = ({ task }) => {
  let meta = task.meta;
  if (task.type === "test" && task.result?.state === "fail" && meta.storyId && task.result.errors?.[0]) {
    let currentError = task.result.errors[0], storyUrl = `${import.meta.env.__STORYBOOK_URL__}/?path=/story/${meta.storyId}&addonPanel=${PANEL_ID}`;
    currentError.message = `
\x1B[34mClick to debug the error directly in Storybook: ${storyUrl}\x1B[39m

${currentError.message}`;
  }
};
initTransport();
beforeAll(() => {
  if (globalThis.globalProjectAnnotations)
    return globalThis.globalProjectAnnotations.beforeAll();
});
afterEach((ctx) => {
  restoreDefaultChannel(), modifyErrorMessage({ task: ctx.task });
});
export {
  initTransport,
  modifyErrorMessage,
  restoreDefaultChannel
};
