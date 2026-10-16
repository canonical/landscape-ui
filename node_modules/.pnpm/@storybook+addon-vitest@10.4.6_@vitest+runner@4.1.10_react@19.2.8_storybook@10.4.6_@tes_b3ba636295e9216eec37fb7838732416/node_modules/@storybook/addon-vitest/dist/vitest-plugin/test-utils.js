import {
  STORYBOOK_CORE_GHOST_STORIES_PROVIDE_KEY,
  STORYBOOK_CORE_RENDER_ANALYSIS_PROVIDE_KEY,
  STORYBOOK_TEST_PROVIDE_KEY
} from "../_browser-chunks/chunk-OHAJYSSA.js";

// src/vitest-plugin/test-utils.ts
import { inject } from "vitest";
import { getStoryChildren, isStory } from "storybook/internal/csf";
import { composeStory, getCsfFactoryAnnotations } from "storybook/preview-api";

// src/vitest-plugin/viewports.ts
import { UnsupportedViewportDimensionError } from "storybook/internal/preview-errors";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";
var DEFAULT_VIEWPORT_DIMENSIONS = {
  width: 1200,
  height: 900
}, validPixelOrNumber = /^\d+(px)?$/, percentagePattern = /^(\d+(\.\d+)?%)$/, vwPattern = /^(\d+(\.\d+)?vw)$/, vhPattern = /^(\d+(\.\d+)?vh)$/, emRemPattern = /^(\d+)(em|rem)$/, parseDimension = (value, dimension) => {
  if (validPixelOrNumber.test(value))
    return Number.parseInt(value, 10);
  if (percentagePattern.test(value)) {
    let percentageValue = parseFloat(value) / 100;
    return Math.round(DEFAULT_VIEWPORT_DIMENSIONS[dimension] * percentageValue);
  } else if (vwPattern.test(value)) {
    let vwValue = parseFloat(value) / 100;
    return Math.round(DEFAULT_VIEWPORT_DIMENSIONS.width * vwValue);
  } else if (vhPattern.test(value)) {
    let vhValue = parseFloat(value) / 100;
    return Math.round(DEFAULT_VIEWPORT_DIMENSIONS.height * vhValue);
  } else {
    if (emRemPattern.test(value))
      return Number.parseInt(value, 10) * 16;
    throw new UnsupportedViewportDimensionError({ dimension, value });
  }
}, setViewport = async (parameters = {}, globals = {}) => {
  let defaultViewport, viewportsParam = parameters.viewport ?? {}, viewportsGlobal = globals.viewport ?? {}, isDisabled = viewportsParam.disable || viewportsParam.disabled;
  viewportsGlobal.value && !isDisabled ? defaultViewport = viewportsGlobal.value : isDisabled || (defaultViewport = viewportsParam.defaultViewport);
  let { page } = await import("@vitest/browser/context").catch(() => ({
    page: null
  }));
  if (!page || !globalThis.__vitest_browser__)
    return;
  let options = {
    ...MINIMAL_VIEWPORTS,
    ...viewportsParam.viewports,
    ...viewportsParam.options
  }, viewportWidth = DEFAULT_VIEWPORT_DIMENSIONS.width, viewportHeight = DEFAULT_VIEWPORT_DIMENSIONS.height;
  if (defaultViewport && defaultViewport in options) {
    let { styles } = options[defaultViewport];
    if (styles?.width && styles?.height) {
      let { width, height } = styles;
      viewportWidth = parseDimension(width, "width"), viewportHeight = parseDimension(height, "height");
    }
  }
  await page.viewport(viewportWidth, viewportHeight);
};

// src/vitest-plugin/test-utils.ts
var convertToFilePath = (url) => url.replace(/^file:\/\//, "").replace(/^\/+([a-zA-Z]:)/, "$1").replace(/%20/g, " "), testStory = ({
  exportName,
  story,
  meta,
  skipTags,
  storyId,
  componentPath,
  testName,
  componentName
}) => async (context) => {
  let annotations = getCsfFactoryAnnotations(story, meta), test = isStory(story) && testName ? getStoryChildren(story).find((child) => child.input.name === testName) : void 0, storyAnnotations = test ? test.input : annotations.story, runConfig = { a11y: !0 };
  try {
    runConfig = inject(STORYBOOK_TEST_PROVIDE_KEY) ?? { a11y: !0 };
  } catch {
  }
  let ghostStoriesEnabled = !1;
  try {
    ghostStoriesEnabled = inject(STORYBOOK_CORE_GHOST_STORIES_PROVIDE_KEY) ?? !1;
  } catch {
  }
  let renderAnalysisEnabled = !1;
  try {
    renderAnalysisEnabled = inject(STORYBOOK_CORE_RENDER_ANALYSIS_PROVIDE_KEY) ?? !1;
  } catch {
  }
  let shouldRunA11yTests = !!runConfig.a11y, initialGlobals = {
    [STORYBOOK_TEST_PROVIDE_KEY]: runConfig,
    ...ghostStoriesEnabled ? {
      ghostStories: {
        enabled: !0
      }
    } : {},
    ...renderAnalysisEnabled ? {
      renderAnalysis: {
        enabled: !0
      }
    } : {},
    a11y: {
      manual: !shouldRunA11yTests
    }
  }, composedStory = composeStory(
    storyAnnotations,
    annotations.meta,
    { initialGlobals },
    annotations.preview ?? globalThis.globalProjectAnnotations,
    exportName
  );
  (composedStory === void 0 || skipTags?.some((tag) => composedStory.tags.includes(tag))) && context.skip(), context.story = composedStory;
  let _task = context.task;
  _task.meta.storyId = storyId, _task.meta.componentPath = componentPath, _task.meta.componentName = componentName, await setViewport(composedStory.parameters, composedStory.globals), await composedStory.run(void 0), _task.meta.reports = composedStory.reporting.reports;
};
export {
  convertToFilePath,
  testStory
};
