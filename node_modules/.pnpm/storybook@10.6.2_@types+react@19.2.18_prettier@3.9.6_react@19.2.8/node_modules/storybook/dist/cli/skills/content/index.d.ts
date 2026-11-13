import { i as ToolsetCtx } from "../../../chunk-BeknTQDg.js";

//#region code/core/.dts-emit/code/core/src/cli/skills/content/skills.d.ts
/**
 * The Storybook skills: agent-facing instruction documents served by `storybook skills <id>`
 * and, on the MCP side, by addon-mcp (server instructions and the story-instructions tool). The
 * ids are public CLI vocabulary — plugin stubs (M7) will reference them — so treat renames as
 * breaking.
 */
declare const SKILL_IDS: readonly ['stories', 'write-story', 'setup'];
type SkillId = (typeof SKILL_IDS)[number];
declare const SKILLS: Record<SkillId, {
  blurb: string;
}>;
declare function isSkillId(value: string): value is SkillId;
//#endregion
//#region code/core/.dts-emit/code/core/src/cli/skills/content/skill-refs.d.ts
type SkillTransport = ToolsetCtx['transport'];
/**
 * Renders a cross-reference to a skill in the transport's own vocabulary, mirroring `getToolName` for
 * toolset methods: the MCP tool name where one exists, the `storybook skills` command otherwise.
 */
declare function getSkillRef(transport: SkillTransport): (id: SkillId) => string;
//#endregion
//#region code/core/.dts-emit/code/core/src/cli/skills/content/build-server-instructions.d.ts
type ServerInstructionsInputs = {
  transport: SkillTransport;
  devEnabled: boolean;
  testSupported: boolean;
  docsEnabled: boolean;
  changeDetectionEnabled?: boolean;
  /**
   * `stories-find-by-component` is registered whenever the dev-server exposes the module
   * graph — even if `features.changeDetection` is off and `stories-changed` is unavailable.
   * When true and `changeDetectionEnabled` is false, the workflow falls back to manual lookup
   * via `stories-find-by-component` instead of the status-store-driven `stories-changed`.
   */
  moduleGraphSupported?: boolean;
  reviewEnabled?: boolean;
};
/**
 * The full rule for how the agent should present links in its final
 * user-facing response, delivered through the
 * `get-storybook-story-instructions` output. The server instructions only
 * carry a terse pointer to the same rule: MCP clients truncate server
 * instructions (Claude Code cuts them at 2,048 chars), so anything beyond
 * the workflow trigger must live in tool descriptions and tool results.
 *
 * Keyed on whether `review-create` is available in this Storybook setup.
 * When available, the guidance covers both paths: ending with a review section
 * after publishing, or falling back to preview URLs when no review was published
 * (e.g. non-visual refactors).
 */
declare function getFinalLinksGuidance(transport: SkillTransport, reviewToolAvailable: boolean): string;
declare function buildServerInstructions({
  transport,
  ...options
}: ServerInstructionsInputs): string;
//#endregion
//#region code/core/.dts-emit/code/core/src/cli/skills/content/build-story-instructions.d.ts
type StoryInstructionsInputs = {
  transport: SkillTransport;
  framework: string; /** Renderer package name; defaults to `framework` when unmapped (today's behavior). */
  renderer?: string;
  changeDetectionEnabled: boolean;
  reviewEnabled: boolean;
  testSupported: boolean;
  a11yEnabled: boolean;
  docsEnabled: boolean;
};
declare function buildStoryInstructions({
  transport,
  framework,
  renderer,
  changeDetectionEnabled,
  reviewEnabled,
  testSupported,
  a11yEnabled,
  docsEnabled
}: StoryInstructionsInputs): string;
//#endregion
//#region code/core/.dts-emit/code/core/src/cli/skills/content/framework-renderer.d.ts
declare const frameworkToRendererMap: Record<string, string>;
//#endregion
export { SKILLS, SKILL_IDS, type ServerInstructionsInputs, type SkillId, type SkillTransport, type StoryInstructionsInputs, buildServerInstructions, buildStoryInstructions, frameworkToRendererMap, getFinalLinksGuidance, getSkillRef, isSkillId };