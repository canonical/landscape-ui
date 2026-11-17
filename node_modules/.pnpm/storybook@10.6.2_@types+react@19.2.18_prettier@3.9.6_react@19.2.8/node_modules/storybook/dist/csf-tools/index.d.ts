import { ArgTypes } from "storybook/internal/csf";
import { ComponentAnnotations, CsfEnricher, IndexInput, IndexInputStats, IndexedCSFFile, StoriesEntry, StoryAnnotations, Tag as Tag$1 } from "storybook/internal/types";
import { GeneratorOptions, NodePath, RecastOptions, babelParse, generate, types } from "storybook/internal/babel";

//#region code/core/.dts-emit/code/core/src/csf-tools/PrintResultType.d.ts
interface PrintResultType {
  code: string;
  map?: any;
  toString(): string;
}
//#endregion
//#region code/core/.dts-emit/code/core/src/csf-tools/CsfFile.d.ts
interface BabelFile {
  ast: types.File;
  opts: any;
  hub: any;
  metadata: object;
  path: NodePath<types.Program>;
  scope: any;
  inputMap: object | null;
  code: string;
}
declare const isValidPreviewPath: (filepath: string) => boolean;
declare const isModuleMock: (importPath: string) => boolean;
interface CsfOptions {
  fileName?: string;
  makeTitle: (userTitle: string) => string;
  /**
   * If an inline meta is detected e.g. `export default { title: 'foo' }` it will be transformed
   * into a constant format e.g. `export const _meta = { title: 'foo' }; export default _meta;`
   */
  transformInlineMeta?: boolean;
}
declare class NoMetaError extends Error {
  constructor(message: string, ast: types.Node, fileName?: string);
}
declare class MultipleMetaError extends Error {
  constructor(message: string, ast: types.Node, fileName?: string);
}
declare class MixedFactoryError extends Error {
  constructor(message: string, ast: types.Node, fileName?: string);
}
declare class BadMetaError extends Error {
  constructor(message: string, ast: types.Node, fileName?: string);
}
interface StaticMeta extends Pick<ComponentAnnotations, 'id' | 'title' | 'includeStories' | 'excludeStories' | 'tags'> {
  component?: string;
}
interface StaticStory extends Pick<StoryAnnotations, 'name' | 'parameters' | 'tags'> {
  id: string;
  localName?: string;
  __stats: IndexInputStats;
}
interface StoryTest {
  node: types.Node;
  function: types.Node;
  name: string;
  id: string;
  tags: string[];
  parent: {
    node: types.Node;
  };
}
declare class CsfFile {
  _ast: types.File;
  _file: BabelFile;
  _options: CsfOptions;
  _rawComponentPath?: string;
  _componentImportSpecifier?: types.ImportSpecifier | types.ImportDefaultSpecifier;
  _meta?: StaticMeta;
  _stories: Record<string, StaticStory>;
  _metaAnnotations: Record<string, types.Node>;
  _storyExports: Record<string, types.VariableDeclarator | types.FunctionDeclaration>;
  _storyDeclarationPath: Record<string, NodePath<types.VariableDeclarator | types.FunctionDeclaration>>;
  _storyPaths: Record<string, NodePath<types.ExportNamedDeclaration>>;
  _metaStatement: types.Statement | undefined;
  _metaStatementPath: NodePath<types.Statement> | undefined;
  _metaNode: types.ObjectExpression | undefined;
  _metaPath: NodePath<types.ExportDefaultDeclaration> | undefined;
  _metaVariableName: string | undefined;
  _metaIsFactory: boolean | undefined;
  _storyStatements: Record<string, types.ExportNamedDeclaration | types.Expression>;
  _storyAnnotations: Record<string, Record<string, types.Node>>;
  _templates: Record<string, types.Expression>;
  _namedExportsOrder?: string[];
  imports: string[];
  _tests: StoryTest[];
  constructor(ast: types.File, options: CsfOptions, file: BabelFile);
  _parseTitle(value: types.Node): string;
  _parseMeta(declaration: types.ObjectExpression, program: types.Program): void;
  getStoryExport(key: string): types.Node;
  parse(): CsfFile & IndexedCSFFile;
  get meta(): StaticMeta | undefined;
  get stories(): StaticStory[];
  getStoryTests(story: string | types.Node): StoryTest[];
  get indexInputs(): IndexInput[];
}
/** Using new babel.File is more powerful and give access to API such as buildCodeFrameError */
declare const babelParseFile: ({
  code,
  filename,
  ast
}: {
  code: string;
  filename?: string;
  ast?: types.File;
}) => BabelFile;
declare const loadCsf: (code: string, options: CsfOptions) => CsfFile;
declare const formatCsf: (csf: CsfFile, options?: GeneratorOptions & {
  inputSourceMap?: any;
}, code?: string) => ReturnType<typeof generate> | string;
/** Use this function, if you want to preserve styles. Uses recast under the hood. */
declare const printCsf: (csf: CsfFile, options?: RecastOptions) => PrintResultType;
declare const readCsf: (fileName: string, options: CsfOptions) => Promise<CsfFile>;
declare const writeCsf: (csf: CsfFile, fileName?: string) => Promise<void>;
//#endregion
//#region code/core/.dts-emit/code/core/src/csf-tools/ConfigFile.d.ts
declare const _getPathProperties: (path: string[], node: types.Node) => types.ObjectProperty[] | undefined;
declare class ConfigFile {
  _ast: types.File;
  _code: string;
  _exports: Record<string, types.Expression>;
  _exportDecls: Record<string, types.VariableDeclarator | types.FunctionDeclaration>;
  _exportsObject: types.ObjectExpression | undefined;
  _quotes: 'single' | 'double' | undefined;
  fileName?: string;
  hasDefaultExport: boolean;
  constructor(ast: types.File, code: string, fileName?: string);
  _parseExportsObject(exportsObject: types.ObjectExpression): void;
  /** Unwraps TS assertions/satisfies from a node, to get the underlying node. */
  _unwrap: (node: types.Node | undefined | null) => any;
  /**
   * Resolve a declaration node by unwrapping TS assertions/satisfies and following identifiers to
   * resolve the correct node in case it's an identifier.
   */
  _resolveDeclaration: (node: types.Node, parent?: types.Node) => any;
  parse(): this;
  getFieldNode(path: string[]): types.Node | undefined;
  getFieldProperties(path: string[]): ReturnType<typeof _getPathProperties>;
  getFieldValue<T = any>(path: string[]): T | undefined;
  getSafeFieldValue(path: string[]): any;
  setFieldNode(path: string[], expr: types.Expression): void;
  /**
   * @example
   *
   * ```ts
   * // 1. { framework: 'framework-name' }
   * // 2. { framework: { name: 'framework-name', options: {} }
   * getNameFromPath(['framework']); // => 'framework-name'
   * ```
   *
   * @returns The name of a node in a given path, supporting the following formats:
   */
  getNameFromPath(path: string[]): string | undefined;
  /**
   * Returns an array of names of a node in a given path, supporting the following formats:
   *
   * @example
   *
   * ```ts
   * const config = {
   *   addons: ['first-addon', { name: 'second-addon', options: {} }],
   * };
   * // => ['first-addon', 'second-addon']
   * getNamesFromPath(['addons']);
   * ```
   */
  getNamesFromPath(path: string[]): string[] | undefined;
  _getPnpWrappedValue(node: types.Node): string | undefined;
  /**
   * Given a node and a fallback property, returns a **non-evaluated** string value of the node.
   *
   * 1. `{ node: 'value' }`
   * 2. `{ node: { fallbackProperty: 'value' } }`
   */
  _getPresetValue(node: types.Node, fallbackProperty: string): string;
  removeField(path: string[]): void;
  appendValueToArray(path: string[], value: any): void;
  appendNodeToArray(path: string[], node: types.Expression): void;
  /**
   * Specialized helper to remove addons or other array entries that can either be strings or
   * objects with a name property.
   */
  removeEntryFromArray(path: string[], value: string): void;
  _inferQuotes(): "double" | "single";
  valueToNode(value: any): types.Expression | undefined;
  setFieldValue(path: string[], value: any): void;
  getBodyDeclarations(): types.Statement[];
  setBodyDeclaration(declaration: types.Declaration): void;
  /**
   * Import specifiers for a specific require import
   *
   * @example
   *
   * ```ts
   * // const { foo } = require('bar');
   * setRequireImport(['foo'], 'bar');
   *
   * // const foo = require('bar');
   * setRequireImport('foo', 'bar');
   * ```
   *
   * @param importSpecifiers - The import specifiers to set. If a string is passed in, a default
   *   import will be set. Otherwise, an array of named imports will be set
   * @param fromImport - The module to import from
   */
  setRequireImport(importSpecifier: string[] | string, fromImport: string): void;
  /**
   * Set import specifiers for a given import statement.
   *
   * Does not support setting type imports (yet)
   *
   * @example
   *
   * ```ts
   * // import { foo } from 'bar';
   * setImport(['foo'], 'bar');
   *
   * // import foo from 'bar';
   * setImport('foo', 'bar');
   *
   * // import * as foo from 'bar';
   * setImport({ namespace: 'foo' }, 'bar');
   *
   * // import 'bar';
   * setImport(null, 'bar');
   * ```
   *
   * @param importSpecifiers - The import specifiers to set. If a string is passed in, a default
   *   import will be set. Otherwise, an array of named imports will be set
   * @param fromImport - The module to import from
   */
  setImport(importSpecifier: string[] | string | {
    namespace: string;
  } | null, fromImport: string): void;
  _removeRequireImport(importSpecifier: string[] | string | {
    namespace: string;
  } | null, fromImport: string): void;
  _removeImport(importSpecifier: string[] | string | {
    namespace: string;
  } | null, fromImport: string): void;
  /**
   * Remove import specifiers for a given import statement.
   *
   * Does not support removing type imports (yet)
   *
   * @example
   *
   * ```ts
   * // import { foo } from 'bar';
   * setImport(['foo'], 'bar');
   *
   * // import foo from 'bar';
   * setImport('foo', 'bar');
   *
   * // import * as foo from 'bar';
   * setImport({ namespace: 'foo' }, 'bar');
   *
   * // import 'bar';
   * setImport(null, 'bar');
   * ```
   *
   * @param importSpecifiers - The import specifiers to remove. If a string is passed in, will only
   *   remove the default import. Otherwise, named imports matching the array will be removed.
   * @param fromImport - The module to import from
   */
  removeImport(importSpecifier: string[] | string | {
    namespace: string;
  } | null, fromImport: string): void;
}
declare const loadConfig: (code: string, fileName?: string) => ConfigFile;
declare const formatConfig: (config: ConfigFile) => string;
declare const printConfig: (config: ConfigFile, options?: RecastOptions) => PrintResultType;
declare const readConfig: (fileName: string) => Promise<ConfigFile>;
declare const writeConfig: (config: ConfigFile, fileName?: string) => Promise<void>;
declare const isCsfFactoryPreview: (previewConfig: ConfigFile) => boolean;
//#endregion
//#region code/core/.dts-emit/code/core/src/csf-tools/getStorySortParameter.d.ts
declare const getStorySortParameter: (previewCode: string) => any;
//#endregion
//#region code/core/.dts-emit/code/core/src/csf-tools/jsdoc.d.ts
/** Compact JSDoc tag map: tag name → list of tag values (e.g. `@example a` → `{ example: ['a'] }`). */
type JsDocTagMap = Record<string, string[]>;
/**
 * Splits a bare docblock body (no `/**` markers) into its description and a compact tag map.
 *
 * For docblocks that only exist as raw text — CSF story/meta docblocks and TS-less docgen engines.
 * When a TS checker and symbol are available, `extractComponentJsDocInfo` in
 * `core/src/component-meta/jsdoc-info.ts` is the canonical extractor instead; the two differ on
 * malformed input (this one only treats line-leading `@tags` as tags).
 */
declare function extractJSDocInfo(jsdocComment: string): {
  description: string;
  tags: JsDocTagMap;
};
/**
 * Resolves the description, summary, and tag map a docgen payload reports.
 *
 * The CSF `meta` docblock wins over the docgen engine's own component description, and an explicit
 * `@describe` / `@desc` tag wins over the block description. Docgen/provider tags win over same
 * named docblock tags, but a provider that found no tags must not suppress the docblock's own.
 * `extractStoryJSDocInfo` reuses this for story docblocks, so both resolve tags identically.
 */
declare function extractComponentDescription(metaJsDoc: string | undefined, docgenDescription: string | undefined, docgenJsDocTags?: JsDocTagMap): {
  description: string;
  summary: string;
  jsDocTags: JsDocTagMap;
};
//#endregion
//#region code/core/.dts-emit/code/core/src/csf-tools/enrichCsf.d.ts
interface EnrichCsfOptions {
  disableSource?: boolean;
  disableDescription?: boolean;
  enrichCsf?: CsfEnricher;
}
declare const enrichCsfStory: (csf: CsfFile, csfSource: CsfFile, key: string, options?: EnrichCsfOptions) => void;
declare const enrichCsfMeta: (csf: CsfFile, csfSource: CsfFile, options?: EnrichCsfOptions) => void;
declare const enrichCsf: (csf: CsfFile, csfSource: CsfFile, options?: EnrichCsfOptions) => Promise<void>;
declare const extractSource: (node: types.Node) => string;
declare const extractDescription: (node?: types.Node) => string;
//#endregion
//#region code/core/.dts-emit/code/core/src/csf-tools/story-shape/imports.d.ts
interface ImportBinding {
  /** Module specifier the local name is imported from. */
  importId: string;
  /** Original export name; `'default'` or `'*'` for default/namespace imports. */
  importName: string;
}
/** True for `import { type X }` specifiers, which carry no runtime binding. */
declare const isTypeSpecifier: (s: types.ImportSpecifier | types.ImportDefaultSpecifier | types.ImportNamespaceSpecifier) => boolean;
/** Exported name behind an import specifier, incl. string-named exports. */
declare const importedName: (im: types.Identifier | types.StringLiteral) => string;
/** Map of local identifier → import binding for a file's value imports (type-only skipped). */
declare function collectImportBindings(program: NodePath<types.Program>): Map<string, ImportBinding>;
//#endregion
//#region code/core/.dts-emit/code/core/src/csf-tools/story-shape/import-statements.d.ts
/** A component reference resolved to the module binding it comes from. */
interface ImportRef {
  /** Module specifier. Refs without one contribute no import statement. */
  importId?: string;
  /** Exported name; `'default'` for default imports and `'*'` for whole-namespace bindings. */
  importName?: string;
  /** Local identifier the import is bound to. */
  localImportName?: string;
  /** Local identifier of the `import * as` binding this ref reaches through. */
  namespace?: string;
  /** Import statement replacing the derived source and specifier, e.g. from an `@import` tag. */
  importOverride?: string;
  /** Whether `importId` already resolves as a package, which suppresses `packageName` rewriting. */
  isPackage?: boolean;
}
/** An {@link ImportRef} together with the component expression it was resolved from. */
interface ComponentImportRef extends ImportRef {
  /** Component as written in the story file, e.g. `Button` or `Accordion.Root`. */
  componentName: string;
  /** Accessed member of a compound name, e.g. `Root` for `Accordion.Root`. */
  member?: string;
}
/**
 * Resolve a component expression as written in a story file to the import it binds to.
 *
 * A compound name resolves through its base identifier, so `Accordion.Root` reached through
 * `import * as Accordion` exports `Root`, while the same name reached through
 * `import { Accordion }` exports `Accordion` and carries `Root` as the member.
 */
declare function resolveComponentImport(componentName: string, bindings: Map<string, ImportBinding>): ComponentImportRef;
/**
 * Build the minimal, deduplicated set of import declarations the given references need.
 *
 * References are bucketed by their final source, which is the `importOverride` source when one
 * parses, else `packageName` when the original source is not already a package, else the source as
 * written. Sources keep first-seen order and declarations keep a fixed order within a source, so
 * repeated runs produce byte-identical output.
 */
declare function buildImportStatements({
  refs,
  packageName
}: {
  refs: ImportRef[];
  packageName?: string;
}): string[];
//#endregion
//#region code/core/.dts-emit/code/core/src/csf-tools/story-shape/jsdoc.d.ts
/**
 * JSDoc tags on the docblock of the statement a path belongs to.
 *
 * The docblock sits on the enclosing statement rather than the expression itself, so a `meta`
 * object literal has to look upwards to find the comment an author wrote above `const meta`.
 */
declare function jsDocTagsForPath(path?: NodePath<types.Node>): Record<string, string[]>;
/** Story description and summary from its JSDoc; `@describe`/`@desc` tags override the body. */
declare function extractStoryJSDocInfo(storyStatement?: types.Node): {
  description?: string;
  summary?: string;
};
//#endregion
//#region code/core/.dts-emit/code/core/src/csf-tools/story-shape/normalize-story.d.ts
type NormalizedStoryDeclaration = {
  type: 'config';
  path: NodePath<types.ObjectExpression>;
} | {
  type: 'fn';
  path: NodePath<types.ArrowFunctionExpression | types.FunctionExpression | types.FunctionDeclaration>;
} | {
  type: 'emptyConfig';
  path: NodePath<types.Expression>;
};
/**
 * Resolve a story export's declaration to its snippet-ready story shape.
 *
 * @example
 *
 * ```ts
 * export const A: Story = { args: {} }; //            → { type: 'config', path }
 * export const B = {} satisfies Story; //             → { type: 'config', path }
 * export const C = meta.story({ args: {} }); //       → { type: 'config', path }
 * export const D = meta.story(); //                   → { type: 'emptyConfig', path }
 * export const E = Template.bind({}); //              → Template's classified initializer
 * ```
 */
declare function normalizeStoryDeclaration(storyDeclaration: NodePath<types.Node>): NormalizedStoryDeclaration;
//#endregion
//#region code/core/.dts-emit/code/core/src/csf-tools/story-shape/resolve-members.d.ts
/** Members of an object, and what reading it statically could not account for. */
interface ResolvedMembers {
  /** Member name → value node, as of the last write this pass could read. */
  properties: Record<string, types.Node>;
  /**
   * Names whose value an `unresolved` entry written after them may replace at runtime. A member
   * absent from `properties` is only knowably absent when `unresolved` is empty.
   */
  shadowed: string[];
  /** Source text of every member `properties` could not absorb; empty exactly when complete. */
  unresolved: string[];
}
/** A module a reference reaches into, parsed and paired with the path it was read from. */
interface ReferenceModule {
  program: NodePath<types.Program>;
  /** Absolute path `program` was parsed from; the base every import specifier resolves against. */
  filePath: string;
}
/** Everything following a reference beyond the object it starts at needs. */
interface ReferenceContext extends ReferenceModule {
  /**
   * Parses the module an import specifier names. Callers that read a single file leave it unset,
   * which confines resolution to that file.
   */
  resolveModule?: (fromFile: string, specifier: string) => ReferenceModule | undefined;
  /**
   * Rewrites a value read out of another module into one that stands on its own, since the name it
   * was written as means nothing where the snippet lands. Returning `undefined` rejects the value,
   * leaving the reference that reached it unresolved.
   */
  externalize?: (node: types.Node) => types.Node | undefined;
}
/** The half of a {@link ReferenceContext} that is not specific to one story file. */
type StoryReferenceResolver = Pick<ReferenceContext, 'resolveModule' | 'externalize'>;
/** How arg resolution leaves the story file; without it only the story file itself is read. */
interface StoryReferences extends StoryReferenceResolver {
  /** Absolute path of the story file, which every import specifier resolves against. */
  filePath: string;
}
/** Source text of a node, for naming an expression a static pass could not read. */
declare const sourceOf: (node: types.Node) => string;
/**
 * Members of an object literal, absorbing every spread the context can follow.
 *
 * A method shorthand keeps its member, since its key is as knowable as any other; a getter, setter
 * or generator does not, because reading it runs code.
 */
declare const resolveObjectMembers: (object: types.ObjectExpression, ctx: ReferenceContext) => ResolvedMembers;
/**
 * An `args` record, absorbing every spread the context can follow.
 *
 * Unlike {@link resolveObjectMembers} every member has to reduce to a printable value, so a method
 * is reported rather than kept, wherever a spread copied it from.
 */
declare const resolveArgsRecord: (node: types.Node | undefined, ctx: ReferenceContext) => ResolvedMembers;
/**
 * The members a module-level binding holds, following the spreads and references it is composed of.
 *
 * For a CSF factory story the members are the ones behind `input`, matching how the factory exposes
 * the config it was called with. `undefined` when the binding cannot be read at all.
 */
declare const resolveBindingMembers: (ctx: ReferenceContext, name: string) => ResolvedMembers | undefined;
/**
 * The value a member chain names, paired with the module whose scope its names resolve against.
 *
 * Unlike {@link resolveObjectMembers} the value is returned as written rather than read into
 * members, so a chain landing on a name, as `internal.config.component` reaching the class an
 * Angular story documents does, can be followed further by the caller. `undefined` when the chain
 * leaves what this pass can read, and for a bare identifier, which names no member.
 */
declare const resolveReferencedValue: (ctx: ReferenceContext, expression: types.Node) => {
  node: types.Node;
  ctx: ReferenceContext;
} | undefined;
//#endregion
//#region code/core/.dts-emit/code/core/src/csf-tools/story-shape/reference-context.d.ts
interface StoryReferenceResolverOptions {
  /** Extensions tried ahead of the JS/TS set, for single-file-component formats like `.vue`. */
  extensions?: string[];
  /**
   * Rewrites a value read out of another module into one that stands on its own. Defaults to
   * accepting exactly the values that already do.
   */
  externalize?: StoryReferenceResolver['externalize'];
}
/**
 * Builds the half of a story-file reference context that lets static arg resolution leave the
 * story file.
 *
 * A story's args can spread or name a value another module owns, so resolving them reads those
 * modules too. The returned function opens a resolver for one build, which parses each module it
 * reaches at most once; module *resolutions* are cached across builds, since a specifier resolving
 * to a different file is far rarer than that file's contents changing:
 *
 * ```ts
 * const openStoryReferences = createStoryReferenceResolver();
 * // per build:
 * const resolver = createStoryArgsResolver(csf, { filePath: storyPath, ...openStoryReferences() });
 * ```
 */
declare function createStoryReferenceResolver(options?: StoryReferenceResolverOptions): () => StoryReferenceResolver;
/** Parses a module reached by an import, for a caller that already resolved its path. */
declare const parseReferenceModule: (filePath: string) => ReferenceModule | undefined;
//#endregion
//#region code/core/.dts-emit/code/core/src/csf-tools/story-shape/resolve-arg-value.d.ts
/** An arg value read through to the definition it names, and what printing it still depends on. */
interface ResolvedArgValue {
  /** Node to print in place of what was written. */
  node: types.Node;
  /** Imports the printed node needs to resolve where the snippet lands. */
  imports: ImportRef[];
  /** Source text of every name the printed node depends on that no import can supply. */
  unresolved: string[];
}
/**
 * The value an arg node stands for, following a name to the definition it refers to.
 *
 * A name the story file declares resolves to the value it was declared with, since that name means
 * nothing where the snippet lands. A name another module owns stays as written and reports the
 * import that makes it resolve. Names a larger expression reaches for are reported the same way,
 * except that a locally declared one can only be named, not substituted into the expression.
 */
declare const resolveArgValue: (node: types.Node, ctx: ReferenceContext) => ResolvedArgValue;
/**
 * Whether printing a node needs no name from the scope it was written in.
 *
 * This is the bar a value copied out of another module has to clear, since the names that module
 * declares and imports mean nothing where the snippet lands.
 */
declare const isSelfContained: (node: types.Node) => boolean;
//#endregion
//#region code/core/.dts-emit/code/core/src/csf-tools/story-shape/resolve-story-args.d.ts
/** Everything reading one story's args statically produced. */
interface ResolvedStoryArgs {
  /** Meta args merged under story args, keyed by arg name, every value read through. */
  args: Record<string, types.Node>;
  /** Imports the arg values need beyond the component, from values that kept a name. */
  imports: ImportRef[];
  /** Source text of everything hiding args from this pass; empty when the merged args are known. */
  unresolved: string[];
  /** The story's own config members, spreads and names followed. */
  storyMembers: ResolvedMembers;
  /** The meta's config members, spreads and names followed. */
  metaMembers: ResolvedMembers;
}
interface StoryArgsResolver {
  /** The context every resolution in this file runs against. */
  ctx: ReferenceContext;
  resolve: (storyExport: string) => ResolvedStoryArgs;
}
/**
 * Builds the args resolver for one story file, resolving the meta once for all of its stories.
 *
 * Pass `references` to let a story's args resolve names other modules own; without it only the
 * story file itself is read, and anything it reaches for elsewhere is reported as unresolved.
 */
declare function createStoryArgsResolver(csf: CsfFile, references?: StoryReferences): StoryArgsResolver;
/** Says which source text a static pass could not read, so a reader can see what is missing. */
declare const unresolvedWarning: (unresolved: readonly string[]) => string | undefined;
/** {@link unresolvedWarning} for a story that gets no snippet at all instead of a partial one. */
declare const noSnippetWarning: (unresolved: readonly string[]) => string | undefined;
//#endregion
//#region code/core/.dts-emit/code/core/src/csf-tools/story-shape/render.d.ts
/** A function a story or meta supplies through `render`. */
type RenderFunctionPath = NodePath<types.ArrowFunctionExpression | types.FunctionExpression | types.FunctionDeclaration | types.ObjectMethod>;
/**
 * Outcome of looking for a `render` function.
 *
 * `missing` and `unresolved` have to stay distinct. A story whose `render` exists but cannot be
 * read must not fall back to the meta's `render`: the story's intent was to override it, and
 * quietly rendering the meta's version instead produces a snippet for code the story never runs.
 *
 * `shadowedRender` is present when an explicit render resolved but a later spread may replace it
 * at runtime. Strict consumers ignore it and emit nothing; coverage-oriented consumers may prefer
 * it as the best static guess, since spreads rarely carry a render.
 */
type RenderResolution = {
  kind: 'missing';
} | {
  kind: 'resolved';
  path: RenderFunctionPath;
} | {
  kind: 'unresolved';
  shadowedRender?: RenderFunctionPath;
};
/**
 * Resolves the `render` property of a story or meta config, following a local identifier
 * (`render: Template`) to the function it names and accepting the `render(args) {}` method
 * shorthand.
 *
 * Spread semantics follow the runtime: a spread written after `render` can shadow it, so the
 * result is `unresolved` (carrying the shadowed function); a spread before it is harmless because
 * the explicit property wins. When `render` is missing, any spread could still be supplying one,
 * which is also `unresolved`.
 *
 * `storyDeclaration` anchors the identifier lookup to the module the story lives in, so a helper
 * declared beside the story resolves while an imported one reports `unresolved`.
 *
 * `references` lets a spread be read rather than assumed: with it, `{ ...Base }` reports whichever
 * `render` `Base` supplies, or `missing` when it supplies none, instead of the `unresolved` a pass
 * that cannot see through the spread has to report.
 *
 * Throws when `render` is present but is neither a function nor an identifier, because that is a
 * story-file mistake rather than something a static pass merely could not follow.
 */
declare function resolveRenderFunction(config: NodePath<types.ObjectExpression> | undefined, storyDeclaration: NodePath<types.Node>, references?: ReferenceContext): RenderResolution;
//#endregion
//#region code/core/.dts-emit/code/core/src/csf-tools/story-shape/utils.d.ts
type StaticIdentifierMemberCall = types.CallExpression & {
  callee: types.MemberExpression & {
    object: types.Identifier;
    property: types.Identifier;
  };
};
/** Peels TS assertion/satisfies wrappers and parentheses off an expression node. */
declare const unwrapExpression: (node: types.Node) => types.Node;
declare const isCanonicalCsf2BindCall: (node: types.Node) => node is StaticIdentifierMemberCall;
declare const isCsfFactoryCall: (node: types.Node) => node is StaticIdentifierMemberCall;
/**
 * Static key of an object member, or `null` when it is computed from something else.
 *
 * A computed key written as a string literal is static: `{ ['args']: … }` names the same member as
 * `{ args: … }`, so it reads as that name rather than as a key only running the story would produce.
 */
declare const keyOf: (p: types.ObjectMethod | types.ObjectProperty) => string | null;
/** Value of an object expression's own property, when it has one. */
declare const propertyValue: (object: types.ObjectExpression | undefined | null, name: string) => types.Node | undefined;
/**
 * Expression a function returns directly, covering the concise body (`() => …`) and a block body
 * that is only a `return`.
 *
 * A block body must hold nothing but that `return`, since any extra statement could change what the
 * expression evaluates to and a static reader cannot follow it.
 */
declare const returnedExpression: (fn: types.Node | undefined) => types.Expression | undefined;
/** {@link returnedExpression} as a path, for callers that resolve identifiers against scope. */
declare const returnedExpressionPath: (renderFunction: RenderFunctionPath) => NodePath<types.Expression> | undefined;
/**
 * Object literal a render function resolves to, following a local identifier when it returns one.
 *
 * @example `() => ({ template })` and `() => config` with `const config = { template }` both →
 * that object literal
 */
declare const resolveReturnedObjectExpression: (renderFunction: RenderFunctionPath) => types.ObjectExpression | undefined;
/** Resolve a local story helper used by `Template.bind({})` or `render: Template`. */
declare function resolveIdentifierInit(storyPath: NodePath<types.Node>, identifier: NodePath<types.Identifier>): NodePath<types.FunctionDeclaration> | NodePath<types.Expression> | null;
/** NodePath for a known node inside a program. */
declare function pathForNode<T extends types.Node>(program: NodePath<types.Program>, target: T | undefined): NodePath<T> | undefined;
/** ObjectExpression path for the parsed CSF default meta, when available. */
declare function metaObjectPath(csf: CsfFile): NodePath<types.ObjectExpression> | undefined;
//#endregion
//#region code/core/.dts-emit/code/core/src/csf-tools/vitest-plugin/transformer.d.ts
type TagsFilter = {
  include: string[];
  exclude: string[];
  skip: string[];
};
/**
 * In Storybook users might be importing stories from other story files. As a side effect, tests can
 * get re-triggered. To avoid this, we add a guard to only run tests if the current file is the one
 * running the test.
 *
 * Const isRunningFromThisFile = import.meta.url.includes(expect.getState().testPath ??
 * globalThis.**vitest_worker**.filepath) if(isRunningFromThisFile) { ... }
 */
declare function vitestTransform({
  code,
  fileName,
  configDir,
  stories,
  tagsFilter,
  previewLevelTags
}: {
  code: string;
  fileName: string;
  configDir: string;
  tagsFilter: TagsFilter;
  stories: StoriesEntry[];
  previewLevelTags: Tag$1[];
}): Promise<ReturnType<typeof formatCsf>>;
//#endregion
//#region code/core/.dts-emit/code/core/src/csf-tools/vitest-plugin/component-transformer.d.ts
/**
 * Transforms a component file directly into a Vitest test file. Uses a getComponentArgTypes
 * function to retrieve component argTypes for required prop generation. Uses portable stories to
 * construct a test based on the default state of a component (basic render + required args)
 */
declare const componentTransform: ({
  code,
  fileName,
  getComponentArgTypes
}: {
  code: string;
  fileName: string;
  getComponentArgTypes?: (options: {
    componentName: string;
    fileName: string;
  }) => Promise<ArgTypes | null | undefined>;
}) => Promise<ReturnType<typeof generate> | {
  code: string;
  map: null;
}>;
//#endregion
export { BadMetaError, type ComponentImportRef, ConfigFile, CsfFile, CsfOptions, EnrichCsfOptions, type ImportBinding, type ImportRef, JsDocTagMap, MixedFactoryError, MultipleMetaError, NoMetaError, type NormalizedStoryDeclaration, type ReferenceContext, type ReferenceModule, type RenderFunctionPath, type RenderResolution, type ResolvedArgValue, type ResolvedMembers, type ResolvedStoryArgs, StaticMeta, StaticStory, type StoryArgsResolver, type StoryReferenceResolver, type StoryReferenceResolverOptions, type StoryReferences, StoryTest, babelParse, babelParseFile, buildImportStatements, collectImportBindings, componentTransform, createStoryArgsResolver, createStoryReferenceResolver, enrichCsf, enrichCsfMeta, enrichCsfStory, extractComponentDescription, extractDescription, extractJSDocInfo, extractSource, extractStoryJSDocInfo, formatConfig, formatCsf, getStorySortParameter, importedName, isCanonicalCsf2BindCall, isCsfFactoryCall, isCsfFactoryPreview, isModuleMock, isSelfContained, isTypeSpecifier, isValidPreviewPath, jsDocTagsForPath, keyOf, loadConfig, loadCsf, metaObjectPath, noSnippetWarning, normalizeStoryDeclaration, parseReferenceModule, pathForNode, printConfig, printCsf, propertyValue, readConfig, readCsf, resolveArgValue, resolveArgsRecord, resolveBindingMembers, resolveComponentImport, resolveIdentifierInit, resolveObjectMembers, resolveReferencedValue, resolveRenderFunction, resolveReturnedObjectExpression, returnedExpression, returnedExpressionPath, sourceOf, unresolvedWarning, unwrapExpression, vitestTransform, writeConfig, writeCsf };