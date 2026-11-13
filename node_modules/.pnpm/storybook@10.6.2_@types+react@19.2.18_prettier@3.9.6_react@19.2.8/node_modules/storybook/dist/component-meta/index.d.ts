//#region code/core/.dts-emit/code/core/src/component-meta/types.d.ts
/** LSP-style file change type broadcast to projects (Volar Kit checker vocabulary). */
type FileChangeType = 'changed' | 'created' | 'deleted';
interface FileChange {
  filePath: string;
  type: FileChangeType;
}
/**
 * Structural subset of `ts.ParsedCommandLine` the manager reads: `fileNames` for direct-include
 * matching and `projectReferences` for reference-chain walking.
 *
 * Deliberately not `ts.ParsedCommandLine`: this module's contract must not name types from the
 * `typescript` package. Renderers resolve their own `typescript` copy (frameworks even pin their
 * own versions), and a cross-instance `ts.ParsedCommandLine` comparison walks the entire
 * compiler-API graph (`errors` → `Diagnostic` → `SourceFile` → …), which both couples consumers to
 * core's instance (TS2345) and blows the checker's comparison stack (TS2321). A real
 * `ts.ParsedCommandLine` remains assignable to this shape.
 */
interface ProjectCommandLine {
  fileNames: string[];
  projectReferences?: readonly {
    path: string;
  }[];
}
/**
 * The two filesystem probes the manager needs during tsconfig discovery and watching. `typeof ts`
 * satisfies this (via `ts.sys`), so callers pass their own `typescript` module — without this
 * module ever naming the `typescript` package (see {@link ProjectCommandLine} for why).
 */
interface ComponentMetaFileSystem {
  sys: {
    fileExists(path: string): boolean;
    directoryExists(path: string): boolean;
  };
}
interface ProjectFileSystem {
  sys: {
    fileExists(path: string): boolean;
    readFile(path: string): string | undefined;
    getModifiedTime?(path: string): Date | undefined;
  };
}
/**
 * Contract a per-tsconfig project must satisfy for {@link ../ComponentMetaManager} to manage it.
 *
 * The manager only needs enough surface to match files to tsconfigs (parsed command lines,
 * `hasSourceFile`), keep projects fresh (`onFilesChanged`, `ensureFiles`), watch their source
 * directories (`getSourceFilePaths`), and reclaim memory (`dispose`). What a "project" actually is
 * — a TypeScript language service, a Volar checker — is the renderer's business.
 */
interface ComponentMetaProjectBase {
  getCommandLine(): ProjectCommandLine;
  hasSourceFile(fileName: string): boolean;
  /** Add files to the project's root set (used for inferred projects and on-demand inclusion). */
  ensureFiles(fileNames: string[]): void;
  onFilesChanged(changes: FileChange[]): void;
  /** Non-node_modules source file paths of the current program, for directory watching. */
  getSourceFilePaths(): string[];
  dispose(): void;
}
/**
 * How a renderer turns tsconfigs into projects.
 *
 * `parseCommandLine` matters beyond project creation: the manager matches files to tsconfigs by the
 * parsed `fileNames`, so a renderer whose components are not plain TS must parse with its own
 * machinery (Vue's `createParsedCommandLine` includes `.vue` files; plain TS parsing would not).
 *
 * `CL` lets the factory keep full command-line fidelity internally (e.g. React's real
 * `ts.ParsedCommandLine`): whatever `parseCommandLine` returns is what `createConfiguredProject`
 * receives, while the manager itself only reads the {@link ProjectCommandLine} subset.
 */
interface ComponentMetaProjectFactory<P extends ComponentMetaProjectBase, CL extends ProjectCommandLine = ProjectCommandLine> {
  parseCommandLine(tsconfig: string): CL;
  createConfiguredProject(commandLine: CL, tsconfig: string, getCommandLine: () => CL): P;
  /** Project for files no discovered tsconfig covers; owns its own default compiler options. */
  createInferredProject(): P;
  /**
   * Called when heap pressure recycles the projects. A factory-owned cache that outlives individual
   * projects has to be dropped here too, or the memory floor survives the mechanism meant to lower
   * it.
   */
  recycle?(): void;
  /** Called from the manager's `dispose()` so factory-owned caches die with the manager. */
  dispose?(): void;
}
//#endregion
//#region code/core/.dts-emit/code/core/src/component-meta/ComponentMetaManager.d.ts
declare class ComponentMetaManager<P extends ComponentMetaProjectBase, CL extends ProjectCommandLine = ProjectCommandLine> {
  private typescript;
  private factory;
  private configProjects;
  private inferredProject;
  private rootTsConfigs;
  private searchedDirs;
  private watching;
  private watchersByDir;
  private pendingEvents;
  private readonly heapRecycleThresholdBytes;
  /**
   * @param recycleHeapPressureRatio Fraction of the V8 heap limit at which the shared program(s) are
   *   recycled (see {@link RECYCLE_HEAP_PRESSURE_RATIO}). Exposed for tuning and for the memory
   *   regression gate, which passes `Infinity` to disable recycling and assert the OOM still happens
   *   without the fix. Defaults to {@link RECYCLE_HEAP_PRESSURE_RATIO}.
   */
  constructor(typescript: ComponentMetaFileSystem, factory: ComponentMetaProjectFactory<P, CL>, recycleHeapPressureRatio?: number);
  getProjectForFile(fileName: string): P;
  /**
   * Reclaim the shared program(s)' resident type-resolution cache when heap usage approaches the V8
   * limit, preventing the next extraction's spike from OOMing the dev server. Callers with a
   * batch-extraction surface invoke this after each batch.
   */
  protected recycleProjectsIfHeapPressured(): void;
  private findMatchTSConfig;
  private getOrCreateConfiguredProject;
  private getOrCreateInferredProject;
  /**
   * Broadcast file changes to all projects. Each project selectively bumps projectVersion.
   *
   * Adapted from:
   * https://github.com/volarjs/volar.js/blob/882cd56d46a13d272f34e451f495d3d62251969a/packages/kit/lib/createChecker.ts#L409-L432
   */
  onFilesChanged(changes: FileChange[]): void;
  /**
   * Adapted from:
   * https://github.com/volarjs/volar.js/blob/882cd56d46a13d272f34e451f495d3d62251969a/packages/language-server/lib/project/typescriptProject.ts#L43-L68
   */
  onConfigChanged(configPath: string, type: 'created' | 'changed' | 'deleted'): void;
  startWatching(): void;
  /**
   * Watch directories that contain source files from all TS programs. This covers monorepo setups
   * where stories import components via path aliases (e.g. apps/storybook/ imports from
   * packages/ui/ via tsconfig paths).
   */
  private watchProgramSourceDirs;
  private watchDirectory;
  stopWatching(): void;
  /**
   * Map raw fs.watch events to LSP-style FileChangeType before broadcasting.
   *
   * Fs.watch reports atomic saves (sed -i, editors) as `rename` → we classify as `created` (file
   * exists after rename). But an IDE/LSP would report an atomic save of an _existing_ file as
   * `Changed`, not `Created`.
   *
   * We reclassify here so that onFilesChanged stays 1:1 with Volar Kit.
   */
  private handleFileEvent;
  dispose(): void;
}
declare function sortTSConfigs(file: string, a: string, b: string): number;
declare function isFileInDir(fileName: string, dir: string): boolean;
//#endregion
//#region code/core/.dts-emit/code/core/src/component-meta/jsdoc-info.d.ts
/**
 * Canonical component-level JSDoc extraction for the TS-backed docgen providers.
 *
 * TypeScript's own JSDoc semantics are the contract: whatever `getDocumentationComment` /
 * `getJsDocTags` report is what Storybook documents, matching IDE hovers. Notably, a bare
 * `@tag` preceded by whitespace starts a tag even mid-sentence, while braced inline tags
 * (`{@link Foo}`) stay in the description.
 *
 * Like the rest of this module, no type here names the `typescript` package: callers pass their
 * own `typescript` module and checker, which satisfy these structural subsets.
 *
 * Docblocks with no TS symbol (CSF story/meta docblocks, TS-less docgen engines) are parsed by
 * `csf-tools`' `extractJSDocInfo` instead, whose semantics differ on malformed input.
 */
/** Structural subset of `ts.SymbolDisplayPart`. */
interface JsDocDisplayPart {
  text: string;
  kind: string;
}
/** Structural subset of `ts.JSDocTagInfo`. */
interface JsDocTagInfoLike {
  name: string;
  text?: JsDocDisplayPart[];
}
/** Structural subset of `ts.Symbol` used for export resolution. */
interface JsDocExportSymbolLike {
  flags: number;
  getName(): string;
}
/** Structural subset of `ts.Symbol` — the two documentation accessors. */
interface JsDocSymbolLike<TChecker> extends JsDocExportSymbolLike {
  getDocumentationComment(typeChecker: TChecker | undefined): JsDocDisplayPart[];
  getJsDocTags(checker?: TChecker): JsDocTagInfoLike[];
}
/** The part of the `typescript` module the extractor needs. */
interface JsDocHost {
  SymbolFlags: {
    Alias: number;
  };
  displayPartsToString(displayParts: JsDocDisplayPart[] | undefined): string;
}
/** Structural subset of `ts.TypeChecker` used for export resolution. */
interface JsDocExportCheckerLike<TSourceFile, TSymbol extends JsDocExportSymbolLike> {
  getAliasedSymbol(symbol: TSymbol): TSymbol;
  getExportsOfModule(moduleSymbol: TSymbol): TSymbol[];
  getSymbolAtLocation(node: TSourceFile): TSymbol | undefined;
}
interface ComponentJsDocInfo {
  description: string;
  /** Tag name → one trimmed value per occurrence, in source order. Empty when the symbol has no tags. */
  jsDocTags: Record<string, string[]>;
}
/** Resolve a module export by name, following alias symbols to the declared target. */
declare function resolveExportedSymbol<TSourceFile, TSymbol extends JsDocExportSymbolLike>(typescript: JsDocHost, checker: JsDocExportCheckerLike<TSourceFile, TSymbol>, sourceFile: TSourceFile, exportName: string): TSymbol | undefined;
declare function extractComponentJsDocInfo<TChecker>(typescript: JsDocHost, checker: TChecker, symbol: JsDocSymbolLike<TChecker>): ComponentJsDocInfo;
//#endregion
//#region code/core/.dts-emit/code/core/src/component-meta/parse-tsconfig.d.ts
/**
 * The tsconfig-parsing surface of the `typescript` module this helper drives.
 */
interface TsconfigParserModule {
  sys: {
    readFile(path: string): string | undefined;
  };
  readJsonConfigFile(fileName: string, readFile: (path: string) => string | undefined): unknown;
  /**
   * Incidental parameters are `any`, not `unknown`: the consumer's function is a plain declaration
   * (no method bivariance), so under `strictFunctionTypes` these positions are checked
   * contravariantly against the consumer's own `TsConfigSourceFile`/`CompilerOptions`/… — the exact
   * cross-instance comparison this contract exists to avoid. `any` is assignable in both
   * directions and keeps the check shallow.
   */
  parseJsonSourceFileConfigFileContent(json: any, host: any, basePath: string, existingOptions: any, configFileName: string, resolutionStack: any, extraFileExtensions: any): ProjectCommandLine & {
    options: {
      outDir?: unknown;
    };
  };
}
/** Structural `ts.FileExtensionInfo`; `scriptKind` is the numeric `ts.ScriptKind` enum value. */
interface FileExtensionInfo {
  extension: string;
  isMixedContent: boolean;
  scriptKind?: number;
}
/**
 * Parse a tsconfig with TypeScript's own machinery, the way `tsc` would, with the two fixes every
 * component-meta project needs: `outDir` neutralized (volar#1786 / TS#30457) and separators
 * normalized for the manager's path comparisons.
 *
 * Adapted from:
 * https://github.com/volarjs/volar.js/blob/882cd56d46a13d272f34e451f495d3d62251969a/packages/language-server/lib/project/typescriptProjectLs.ts#L262-L353
 */
declare function parseTsconfigCommandLine<CL extends ProjectCommandLine = ProjectCommandLine>(typescript: TsconfigParserModule, tsconfig: string, extraFileExtensions?: readonly FileExtensionInfo[]): CL;
//#endregion
//#region code/core/.dts-emit/code/core/src/component-meta/ProjectFileTracker.d.ts
type FileSnapshotCache<Snapshot> = Map<string, [number | undefined, Snapshot | undefined]>;
/** Normalize program file paths and drop node_modules, for the manager's directory watching. */
declare function filterSourceFilePaths(fileNames: readonly string[]): string[];
declare class ProjectFileTracker<Snapshot> {
  private readonly fs;
  private readonly commandLine;
  private readonly snapshots;
  private readonly createSnapshot;
  private readonly getCommandLineFn?;
  private projectVersion;
  private shouldCheckRootFiles;
  private readonly fileVersions;
  constructor(fs: ProjectFileSystem, commandLine: {
    fileNames: string[];
  }, snapshots: FileSnapshotCache<Snapshot>, createSnapshot: (text: string) => Snapshot, getCommandLineFn?: (() => {
    fileNames: string[];
  }) | undefined);
  getProjectVersion(): string;
  getScriptFileNames(): string[];
  getScriptVersion(fileName: string): string;
  /** Mtime-checked read-through: re-reads the file only when its mtime moved or was evicted. */
  getSnapshot(fileName: string): Snapshot | undefined;
  /**
   * Batch-add files to the project's root set (inferred projects and on-demand inclusion). Bumps
   * projectVersion once for the whole batch to avoid repeated program rebuilds.
   */
  ensureFiles(fileNames: string[]): void;
  onFilesChanged(changes: FileChange[], isTracked: (fileName: string) => boolean): boolean;
  ensureFresh(fileNames: string[]): boolean;
  private bumpFileVersion;
  private checkRootFilesUpdate;
}
//#endregion
//#region code/core/.dts-emit/code/core/src/component-meta/ProgramBackedProject.d.ts
/**
 * The slice of a TypeScript `Program` this base reads.
 *
 * Structural, like the rest of this module's contracts: naming `ts.Program` here would tie every
 * renderer to core's copy of the compiler API (see {@link ProjectCommandLine}). `Source` lets a
 * renderer that is backed by a real `ts.Program` carry `ts.SourceFile` through its own subclass
 * without this module ever naming `typescript`; core's own use of `getSourceFile` never looks past
 * truthiness, so it stays correct at the default `unknown`.
 */
interface ProgramLike<Source = unknown> {
  getSourceFile(fileName: string): Source;
  getSourceFiles(): readonly {
    fileName: string;
  }[];
}
/** The slice of a TypeScript `LanguageService` this base drives. `ts.LanguageService` satisfies it. */
interface ProgramProvider<Source = unknown> {
  getProgram(): ProgramLike<Source> | undefined;
  dispose(): void;
}
/**
 * The half of a component-meta project that is the same for every renderer backed by a TypeScript
 * program: answering the manager's membership and lifecycle questions from the current program, and
 * funnelling file events into the shared {@link ProjectFileTracker}.
 *
 * Renderers supply the two things that genuinely differ - how the program is built, and how
 * metadata is extracted from it - by assigning {@link service} and {@link files}. Those are fields
 * rather than constructor parameters because a host usually closes over the tracker, so the service
 * cannot exist before `super()` runs.
 *
 * `dispose` and `onFilesChanged` are overridable: a renderer that schedules background work has to
 * cancel and reschedule it around them.
 */
declare abstract class ProgramBackedProject<Snapshot, Source = unknown> implements ComponentMetaProjectBase {
  protected abstract readonly service: ProgramProvider<Source>;
  protected abstract readonly files: ProjectFileTracker<Snapshot>;
  /** Narrowed by renderers to their own parsed command line, which core must not name. */
  abstract getCommandLine(): ProjectCommandLine;
  dispose(): void;
  ensureFiles(fileNames: string[]): void;
  hasSourceFile(fileName: string): boolean;
  getSourceFilePaths(): string[];
  onFilesChanged(changes: FileChange[]): void;
}
//#endregion
export { type ComponentJsDocInfo, ComponentMetaManager, type ComponentMetaProjectBase, type ComponentMetaProjectFactory, type FileChange, type FileExtensionInfo, type FileSnapshotCache, type JsDocExportCheckerLike, type JsDocExportSymbolLike, type JsDocHost, type JsDocSymbolLike, ProgramBackedProject, type ProgramLike, type ProgramProvider, ProjectFileTracker, type TsconfigParserModule, extractComponentJsDocInfo, filterSourceFilePaths, isFileInDir, parseTsconfigCommandLine, resolveExportedSymbol, sortTSConfigs };