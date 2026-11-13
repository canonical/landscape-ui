import {
  getDocsToolsetInstructions
} from "../../../_browser-chunks/chunk-KJ7GNWII.js";
import {
  getToolName
} from "../../../_browser-chunks/chunk-TYQWMAQX.js";
import "../../../_browser-chunks/chunk-ZF665KZD.js";
import "../../../_browser-chunks/chunk-IMSF75WX.js";

// src/cli/skills/content/skills.ts
var SKILL_IDS = ["stories", "write-story", "setup"], SKILLS = {
  stories: {
    blurb: "The mandatory, ordered workflow for UI changes: discover affected stories, test, and present results."
  },
  "write-story": {
    blurb: "How to write, update, and test Storybook stories for this project: imports, patterns, and conventions."
  },
  setup: {
    blurb: "Setup instructions to write stories for the real components in this project."
  }
};
function isSkillId(value) {
  return SKILL_IDS.includes(value);
}

// src/cli/skills/content/skill-refs.ts
var MCP_SKILL_TOOL_NAMES = {
  "write-story": "get-storybook-story-instructions"
};
function getSkillRef(transport) {
  return (id) => transport === "mcp" && MCP_SKILL_TOOL_NAMES[id] || `npx storybook skills ${id}`;
}

// src/cli/skills/content/instructions/dev-instructions.md
var dev_instructions_default = `## UI Building and Story Writing Workflow

- Before creating or editing components or stories, call **{{GET_STORYBOOK_STORY_INSTRUCTIONS}}**; its output is the source of truth for imports, story patterns, and testing conventions.
- {{PREVIEW_STORIES_STEP}}
- {{FINAL_LINKS_STEP}}{{DISPLAY_REVIEW_STEP}}
- Only use story IDs returned by tools \u2014 never derive them from file names or memory. **{{GET_STORIES_BY_COMPONENT}}** maps any input to stories; its description covers the workflow. No matches means no stories exist yet \u2014 say so.
`;

// src/cli/skills/content/instructions/legacy-dev-instructions.md
var legacy_dev_instructions_default = `## UI Building and Story Writing Workflow

- Before creating or editing components or stories, call **{{GET_STORYBOOK_STORY_INSTRUCTIONS}}**.
- Treat its output as the source of truth for imports, story patterns, and testing conventions.
- After editing anything that changes how the UI looks \u2014 components, stories, styles, themes, colors, design tokens \u2014 call **{{PREVIEW_STORIES}}**, no exceptions; a shared file has no stories of its own, so preview its consumers' stories.
- Include every returned preview URL in your final response.
`;

// src/cli/skills/content/instructions/legacy-test-instructions.md
var legacy_test_instructions_default = `## Validation Workflow

- After editing anything that changes how the UI looks, run **{{RUN_STORY_TESTS}}** \u2014 never a package.json test script.
- Use focused runs while iterating, then a broad pass before handoff when scope is unclear or wide.
- Fix failing tests; never report completion while they are failing.
`;

// src/cli/skills/content/instructions/review-docs-instructions.md
var review_docs_instructions_default = `## Documentation Workflow

**CRITICAL: Never hallucinate component properties!** Undocumented props do not exist \u2014 never assume them from naming or other libraries; verify every prop via these tools, not source or types in node_modules.

1. Call **{{DOCS_LIST}}** once at task start for component and docs IDs.
2. Call **{{DOCS_SHOW}}** with an \`id\` from that list for props and usage examples.

Only reference IDs returned by these tools \u2014 never guess; scope multi-source requests with \`storybookId\`.
`;

// src/cli/skills/content/instructions/test-instructions.md
var test_instructions_default = `## Validation Workflow

- After editing anything that changes how the UI looks, run **{{RUN_STORY_TESTS}}** \u2014 never a package.json test script.
- Never report completion while story tests are failing.
`;

// src/cli/skills/content/build-server-instructions.ts
function getFinalLinksGuidance(transport, reviewToolAvailable) {
  let ref = getToolName({ transport });
  return reviewToolAvailable ? `In your final user-facing response, show one set of links \u2014 never both. If you published a review with **${ref("review.create")}**, finish your reply with a dedicated review section as the very last thing in the output: its own top-level heading on a line by itself (for example \`## \u{1F440} Review your changes\`), then a one-line explanation that the review shows the handful of stories most relevant to this change and that, because it is AI-curated, results may be inaccurate or incomplete, then on the next line the review page as a markdown link prefixed with a \u{1F449} so it is easy to spot, using the returned \`reviewUrl\` (for example \`\u{1F449} [Open the Storybook review page](<reviewUrl>)\`). Nothing should come after this section. Never also list the individual story or preview URLs. Avoid internal jargon like "collection" or "trigger" in anything the user reads \u2014 those are terms from this tooling, not words that mean anything to them; use plain language unless the user used the term first. A visually observable change is not finished until its review is published \u2014 never substitute preview URLs for the review. Only when there is no review because the change has no visually observable impact, say so plainly; include preview URLs only if the user asked to see specific stories.` : "In your final user-facing response, include every returned preview URL so the user can verify the visual result, ordered consistently (changed-stories fallback first if relevant, then the specific preview URLs).";
}
function buildServerInstructions({
  transport,
  ...options
}) {
  let ref = getToolName({ transport }), skillRef = getSkillRef(transport), sections = [
    options.docsEnabled ? "Follow these workflows when working with UI and/or Storybook. Answer questions about component props, API, or usage with the documentation tools \u2014 never from source or type definitions." : "Follow these workflows when working with UI and/or Storybook."
  ], reviewEnabled = options.reviewEnabled ?? !1;
  if (options.devEnabled && !reviewEnabled)
    sections.push(
      legacy_dev_instructions_default.replaceAll("{{GET_STORYBOOK_STORY_INSTRUCTIONS}}", skillRef("write-story")).replaceAll("{{PREVIEW_STORIES}}", ref("stories.preview")).trim()
    );
  else if (options.devEnabled) {
    let changeDetection = options.changeDetectionEnabled ?? !1, graphSupported = options.moduleGraphSupported ?? !1, previewStoriesStep = changeDetection ? `After editing anything that changes how the UI looks \u2014 components, stories, styles, themes, tokens \u2014 call **${ref("stories.changed")}** to discover the affected stories.` : graphSupported ? `After editing anything that changes how the UI looks, call **${ref("stories.findByComponent")}** with the files you touched.` : "After editing anything that changes how the UI looks, identify the affected stories.", finalLinksStep = `End your final response with the review section from **${ref("review.create")}**'s result \u2014 never substitute preview URLs. **${ref("stories.preview")}** is only for mid-loop iteration or a requested direct link. If nothing visually changed, say so.`;
    sections.push(
      dev_instructions_default.replaceAll("{{GET_STORYBOOK_STORY_INSTRUCTIONS}}", skillRef("write-story")).replaceAll("{{GET_STORIES_BY_COMPONENT}}", ref("stories.findByComponent")).replace("{{PREVIEW_STORIES_STEP}}", previewStoriesStep).replace("{{FINAL_LINKS_STEP}}", finalLinksStep).replace(
        "{{DISPLAY_REVIEW_STEP}}",
        `
- After a visually observable UI change, or when the user asks to see or browse stories/components, call **${ref("review.create")}** (again on each iteration) and follow its description and result. Visual work is not done until the review is published; any newly created story MUST be included.`
      ).trim()
    );
  }
  return options.testSupported && sections.push(
    (reviewEnabled ? test_instructions_default : legacy_test_instructions_default).replaceAll("{{RUN_STORY_TESTS}}", ref("test.run")).trim()
  ), options.docsEnabled && sections.push(
    (reviewEnabled ? review_docs_instructions_default.replaceAll("{{DOCS_LIST}}", ref("docs.list")).replaceAll("{{DOCS_SHOW}}", ref("docs.show")) : getDocsToolsetInstructions(transport)).trim()
  ), sections.length === 1 ? "" : sections.join(`

`);
}

// src/cli/skills/content/framework-renderer.ts
var frameworkToRendererMap = {
  "@storybook/react-vite": "@storybook/react",
  "@storybook/react-webpack5": "@storybook/react",
  "@storybook/nextjs": "@storybook/react",
  "@storybook/nextjs-vite": "@storybook/react",
  "@storybook/react-native-web-vite": "@storybook/react",
  "@storybook/vue3-vite": "@storybook/vue3",
  "@nuxtjs/storybook": "@storybook/vue3",
  "@storybook/angular": "@storybook/angular",
  "@storybook/angular-vite": "@storybook/angular",
  "@storybook/svelte-vite": "@storybook/svelte",
  "@storybook/sveltekit": "@storybook/svelte",
  "@storybook/preact-vite": "@storybook/preact",
  "@storybook/web-components-vite": "@storybook/web-components",
  "@storybook/html-vite": "@storybook/html"
};

// src/cli/skills/content/instructions/a11y-instructions.md
var a11y_instructions_default = `### Accessibility Violations

**Fix automatically** (semantic/structural, no visual change):

- ARIA attributes, roles, labels, alt text
- Heading hierarchy, landmarks, table structure
- Keyboard access (tabindex, focus, handlers)
- Document-level: lang attr, frame titles, duplicate IDs

**Confirm with user first** (visual/design changes):

- Color contrast ratios
- Font sizes, spacing, layout
- Focus indicator styling

Describe the issue, ask how the user wants to proceed, and provide 2-3 concrete options.
Do not auto-apply visual changes before user confirmation, and do not claim visual issues are fixed until they approve an option.
`;

// src/cli/skills/content/instructions/story-testing-instructions.md
var story_testing_instructions_default = `## Story Testing Requirements

**Run \`{{RUN_STORY_TESTS_TOOL_NAME}}\` after EVERY component or story change.** This includes creating, modifying, or refactoring components, stories, or their dependencies. It is the only way to run story tests \u2014 never run package.json test scripts (like \`npm run test:stories\`) instead.

### Workflow

1. Make your change
2. Run \`{{RUN_STORY_TESTS_TOOL_NAME}}\` with related stories for focused feedback (faster while iterating)
3. If tests fail: analyze, fix{{A11Y_FIX_SUFFIX}}, re-run
4. Repeat until all tests pass

Do not skip tests, ignore failures, or move on with failing tests. If stuck after multiple attempts, report to user.

### Focused vs. full-suite test runs

- Prefer focused runs (\`stories\` input) during development to validate the parts you changed quickly.
- Run all tests (omit \`stories\`) before final handoff, after broad/refactor changes, or when impact is unclear and you need project-wide verification.
`;

// src/cli/skills/content/instructions/storybook-story-instructions.md
var storybook_story_instructions_default = `# Writing User Interfaces

When writing UI, prefer breaking larger components up into smaller parts.

ALWAYS write a Storybook story for any component written. If editing a component, ensure appropriate changes have been made to stories for that component.
{{DOCS_WORKFLOW_GUIDANCE}}

## How to write good stories

Goal: Cover every distinct piece of business logic and state the component can reach (happy paths, error/edge states, loading, permissions/roles, empty states, variations from props/context). Avoid redundant stories that show the same logic.

Interactivity: If the component is interactive, add Interaction tests using play functions that drive the UI with storybook/test utilities (e.g., fn, userEvent, expect). Simulate key user flows: clicking buttons/links, typing, focus/blur, keyboard nav, form submit, async responses, toggle/selection changes, pagination/filters, etc. When passing \`fn\` functions as \`args\` for callback functions, make sure to add a play function which interacts with the component and assert whether the callback function was actually called.

Data/setup: Provide realistic props, state, and mocked data. Include meaningful labels/text to make behaviors observable. Stub network/services with deterministic fixtures; keep stories reliable.

Assertions: In play functions, assert the visible outcome of the interaction (text, aria state, enabled/disabled, class/state changes, emitted events). Prefer role/label-based queries.

Variants to consider (pick only those that change behavior): default vs. alternate themes; loading vs. loaded vs. empty vs. error; validated vs. invalid input; permissions/roles/capabilities; feature flags; size/density/layout variants that alter logic.

Accessibility: Use semantic roles/labels; ensure focusable/keyboard interactions are test-covered where relevant.

Naming/structure: Use clear story names that describe the scenario (\u201CError state after failed submit\u201D). Group related variants logically; don\u2019t duplicate.

Imports/format: Import Meta/StoryObj from the framework package; import test helpers from storybook/test (not @storybook/test). Keep stories minimal\u2014only what's needed to demonstrate behavior.

## Storybook 9 Essential Changes for Story Writing

### Package Consolidation

#### \`Meta\` and \`StoryObj\` imports

Update story imports to use the framework package:

\`\`\`diff
- import { Meta, StoryObj } from '{{RENDERER}}';
+ import { Meta, StoryObj } from '{{FRAMEWORK}}';
\`\`\`

#### Test utility imports

Update test imports to use \`storybook/test\` instead of \`@storybook/test\`

\`\`\`diff
- import { fn } from '@storybook/test';
+ import { fn } from 'storybook/test';
\`\`\`

### Global State Changes

The \`globals\` annotation has be renamed to \`initialGlobals\`:

\`\`\`diff
// .storybook/preview.js
export default {
- globals: { theme: 'light' }
+ initialGlobals: { theme: 'light' }
};
\`\`\`

### Autodocs Configuration

Instead of \`parameters.docs.autodocs\` in main.js, use tags:

\`\`\`js
// .storybook/preview.js or in individual stories
export default {
	tags: ['autodocs'], // generates autodocs for all stories
};
\`\`\`

### Mocking imports in Storybook

To mock imports in Storybook, use Storybook's mocking features. ALWAYS mock external dependencies to ensure stories render consistently.

1. **Register in the mock in Storybook's preview file**:
   To mock dependendencies, you MUST register a module mock in \`.storybook/preview.ts\` (or equivalent):

\`\`\`js
import { sb } from 'storybook/test';

// Prefer spy mocks (keeps functions, but allows to override them and spy on them)
sb.mock(import('some-library'), { spy: true });
\`\`\`

**Important: Use file extensions when referring to relative files!**

\`\`\`js
sb.mock(import('./relative/module.ts'), { spy: true });
\`\`\`

2. **Specify mock values in stories**:
   You can override the behaviour of the mocks per-story using \`beforeEach\` and the \`mocked()\` type function:

\`\`\`js
import { expect, mocked, fn } from 'storybook/test';
import { library } from 'some-library';

const meta = {
  component: AuthButton,
  beforeEach: async () => {
    mocked(library).mockResolvedValue({  user: 'data' });
  },
};

export const LoggedIn: Story = {
  play: async ({ canvas }) => {
    await expect(library).toHaveBeenCalled();
  },
};
\`\`\`

Before doing this ensure you have mocked the import in the preview file.

### Play Function Parameters

- The play function has a \`canvas\` parameter that can be used directly with testing-library-like query methods.
- It also has a \`canvasElement\` which is the actual DOM element.
- The \`within\`-function imported from \`storybook/test\` transforms a DOM element to an object with query methods, similar to \`canvas\`.

**DO NOT** use \`within(canvas)\` - it is redundant because \`canvas\` already has the query methods, \`canvas\` is not a DOM element.

\`\`\`ts
// \u2705 Correct: Use canvas directly
play: async ({ canvas }) => {
	await canvas.getByLabelText('Submit').click();
};

// \u26A0\uFE0F Also acceptable: Use \`canvasElement\` with \`within\`
import { within } from 'storybook/test';

play: async ({ canvasElement }) => {
	const canvas = within(canvasElement);
	await canvas.getByLabelText('Submit').click();
};

// \u274C Wrong: Do NOT use within(canvas)
play: async ({ canvas }) => {
	const screen = within(canvas); // Error!
};
\`\`\`

### Key Requirements

- **Node.js 20+**, **TypeScript 4.9+**
- React Native uses \`.rnstorybook\` directory

## Story Linking Agent Behavior

- ALWAYS provide story links after any changes to stories files, including changes to existing stories.
- {{STORY_LINKING_WORKFLOW}}
- {{FINAL_LINKS_GUIDANCE}}
- When you will share preview/story links (i.e. when you are not collapsing everything into a single review section), pass only the most relevant story IDs into **{{PREVIEW_STORIES}}** (generally no more than 5) so the returned URL list stays manageable. Include every URL returned by that call in your final response \u2014 do not drop links there.
- {{CHANGED_STORY_FALLBACK_LINK_GUIDANCE}}
- After changing any UI components, ALWAYS search for related stories that might cover the changes you've made. If you find any, provide the story links to the user. THIS IS VERY IMPORTANT, as it allows the user to visually inspect the changes you've made. Even later in a session when changing UI components or stories that have already been linked to previously, YOU MUST PROVIDE THE LINKS AGAIN.
`;

// src/cli/skills/content/build-story-instructions.ts
function buildStoryInstructions({
  transport,
  framework,
  renderer,
  changeDetectionEnabled,
  reviewEnabled,
  testSupported,
  a11yEnabled,
  docsEnabled
}) {
  let ref = getToolName({ transport }), resolvedRenderer = renderer ?? frameworkToRendererMap[framework] ?? framework, storyLinkingWorkflow = changeDetectionEnabled ? reviewEnabled ? `After changing any component or story, call \`${ref("stories.changed")}\` to discover the new, modified, and related stories affected by your change. Story IDs must come from that call (or a fallback discovery tool such as ${ref("stories.findByComponent")} for shared-infrastructure changes) \u2014 never construct them from file names, export names, or memory. Feed the discovered IDs into **${ref("review.create")}** when the change is visually observable; use \`${ref("stories.preview")}\` only while iterating on a specific story.` : `After changing UI, call \`${ref("stories.changed")}\` first, then use \`${ref("stories.preview")}\` with selected \`storyId\` values from those results.` : `After changing UI, call \`${ref("stories.preview")}\` and share the most relevant links for the changes.`, changedStoryFallbackLinkGuidance = changeDetectionEnabled ? `When sharing preview/story links (not when ending with a review section): if you did not pass every changed story into \`${ref("stories.preview")}\`, include this Storybook fallback link so the user can view the complete changed list: \`/?statuses=affected;modified;new\`.` : `When sharing preview/story links (not when ending with a review section) and you passed only a subset into \`${ref("stories.preview")}\`, mention that additional relevant stories may exist in Storybook.`, docsWorkflowGuidance = `

## Using library components

This Storybook exposes component documentation tools. Before creating or changing any UI, call **${ref("docs.list")}** once to see what the design system already provides \u2014 build on existing components instead of hand-rolling duplicates \u2014 then call **${ref("docs.show")}** with the \`id\` of each component you build on or get asked about, for its real props and usage examples. When multiple Storybook sources are configured, pass the \`storybookId\` from **${ref("docs.list")}** on follow-up calls. Do this instead of reading the library's source or type definitions out of \`node_modules\` \u2014 stories show intended usage, raw types don't \u2014 and answer props/usage questions from these tools too. Never assume or invent props.`, uiInstructions = storybook_story_instructions_default.replace("{{FRAMEWORK}}", framework).replace("{{RENDERER}}", resolvedRenderer).replace(`
{{DOCS_WORKFLOW_GUIDANCE}}`, docsEnabled ? docsWorkflowGuidance : "").replace("{{STORY_LINKING_WORKFLOW}}", storyLinkingWorkflow).replace("{{FINAL_LINKS_GUIDANCE}}", getFinalLinksGuidance(transport, reviewEnabled)).replace("{{PREVIEW_STORIES}}", ref("stories.preview")).replace("{{CHANGED_STORY_FALLBACK_LINK_GUIDANCE}}", changedStoryFallbackLinkGuidance);
  if (testSupported) {
    let a11yFixSuffix = a11yEnabled ? " (see a11y guidelines below)" : "", storyTestingInstructions = story_testing_instructions_default.replaceAll("{{RUN_STORY_TESTS_TOOL_NAME}}", ref("test.run")).replace("{{A11Y_FIX_SUFFIX}}", a11yFixSuffix);
    uiInstructions += `

${storyTestingInstructions}`, a11yEnabled && (uiInstructions += `
${a11y_instructions_default}`);
  }
  return uiInstructions;
}
export {
  SKILLS,
  SKILL_IDS,
  buildServerInstructions,
  buildStoryInstructions,
  frameworkToRendererMap,
  getFinalLinksGuidance,
  getSkillRef,
  isSkillId
};
