//#region code/core/.dts-emit/code/core/src/csf/export-story.d.ts
type StoryDescriptor = string[] | RegExp;
interface IncludeExcludeOptions {
  includeStories?: StoryDescriptor;
  excludeStories?: StoryDescriptor;
}
/** Transform a CSF named export into a readable story name */
declare const storyNameFromExport: (key: string) => string;
/** Does a named export match CSF inclusion/exclusion options? */
declare function isExportStory(key: string, {
  includeStories,
  excludeStories
}: IncludeExcludeOptions): boolean | null;
//#endregion
//#region code/core/.dts-emit/code/core/src/csf/csf-utils.d.ts
/**
 * Remove punctuation and illegal characters from a story ID, so it is safe to use in URLs and CSS
 * selectors.
 */
declare const sanitize: (string: string) => string;
/** Generate a storybook ID from a component/kind and story name. */
declare const toId: (kind: string, name?: string) => string;
/** Generate a storybook test ID from a story ID and test name. */
declare const toTestId: (parentId: string, testName: string) => string;
interface SeparatorOptions {
  rootSeparator: string | RegExp;
  groupSeparator: string | RegExp;
}
/** Parse out the component/kind name from a path, using the given separator config. */
declare const parseKind: (kind: string, {
  rootSeparator,
  groupSeparator
}: SeparatorOptions) => {
  root: string | null;
  groups: string[];
};
/** Combine a set of project / meta / story tags, removing duplicates and handling negations. */
declare const combineTags: (...tags: string[]) => string[];
//#endregion
export { toId as a, isExportStory as c, sanitize as i, storyNameFromExport as l, combineTags as n, toTestId as o, parseKind as r, IncludeExcludeOptions as s, SeparatorOptions as t };