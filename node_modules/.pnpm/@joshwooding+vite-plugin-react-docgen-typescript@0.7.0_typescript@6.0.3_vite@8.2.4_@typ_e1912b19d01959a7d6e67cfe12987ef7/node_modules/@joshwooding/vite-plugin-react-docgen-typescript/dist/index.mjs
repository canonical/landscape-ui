import { existsSync, readFileSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const DEFAULT_FILE_SYSTEM_CACHE_DIRECTORY = path.join(
  "node_modules",
  ".cache",
  "vite-plugin-react-docgen-typescript"
);
const FILE_SYSTEM_CACHE_VERSION = 5;
const PACKAGE_NAME = "@joshwooding/vite-plugin-react-docgen-typescript";
const resolveTsconfigPath$1 = (rootDir, tsconfigPath) => path.isAbsolute(tsconfigPath) ? tsconfigPath : path.resolve(rootDir, tsconfigPath);
const hashValue = (value) => createHash("sha256").update(value).digest("hex");
const normalizeFileSystemCacheOptions = (fileSystemCache) => {
  if (!fileSystemCache) {
    return false;
  }
  if (fileSystemCache === true) {
    return {};
  }
  return fileSystemCache;
};
const serializeCacheValue = (value, seen) => {
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (typeof value === "function") {
    return {
      __type: "function",
      value: value.toString()
    };
  }
  if (value instanceof RegExp) {
    return {
      __type: "regexp",
      value: value.toString()
    };
  }
  if (Array.isArray(value)) {
    return value.map((item) => serializeCacheValue(item, seen));
  }
  if (value && typeof value === "object") {
    if (seen.has(value)) {
      return "[Circular]";
    }
    seen.add(value);
    return Object.fromEntries(
      Object.entries(value).sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey)).map(([key, item]) => [key, serializeCacheValue(item, seen)])
    );
  }
  return value;
};
const stableStringify = (value) => JSON.stringify(serializeCacheValue(value, /* @__PURE__ */ new WeakSet()));
const getCurrentModuleDirectory = () => path.dirname(fileURLToPath(import.meta.url));
const readPackageVersion = (packageJsonPath) => {
  try {
    const parsedPackage = JSON.parse(
      readFileSync(packageJsonPath, "utf-8")
    );
    return typeof parsedPackage.version === "string" ? parsedPackage.version : void 0;
  } catch {
    return void 0;
  }
};
const findNearestPackageJson = (startDir, packageName) => {
  let currentDir = path.resolve(startDir);
  while (true) {
    const packageJsonPath = path.join(currentDir, "package.json");
    if (existsSync(packageJsonPath)) {
      try {
        const parsedPackage = JSON.parse(
          readFileSync(packageJsonPath, "utf-8")
        );
        if (parsedPackage.name === packageName) {
          return packageJsonPath;
        }
      } catch {
      }
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      return void 0;
    }
    currentDir = parentDir;
  }
};
const findDependencyPackageJson = (startDir, packageName) => {
  let currentDir = path.resolve(startDir);
  const packageSegments = packageName.split("/");
  while (true) {
    const packageJsonPath = path.join(
      currentDir,
      "node_modules",
      ...packageSegments,
      "package.json"
    );
    if (existsSync(packageJsonPath)) {
      return packageJsonPath;
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      return void 0;
    }
    currentDir = parentDir;
  }
};
const resolvePackageVersion = (packageName, searchRoots) => {
  for (const searchRoot of searchRoots) {
    const packageJsonPath = findDependencyPackageJson(searchRoot, packageName);
    if (packageJsonPath) {
      return readPackageVersion(packageJsonPath);
    }
  }
  return void 0;
};
const resolvePluginPackageVersion = () => {
  const packageJsonPath = findNearestPackageJson(
    getCurrentModuleDirectory(),
    PACKAGE_NAME
  );
  return packageJsonPath ? readPackageVersion(packageJsonPath) : void 0;
};
const getPersistedTransformResultPath = (directory, normalizedFileId, source) => path.join(directory, `${hashValue(`${normalizedFileId}\0${source}`)}.json`);
const toPersistedTransformResult = (entry) => entry.result === null ? {
  dependencies: entry.dependencies,
  kind: "null"
} : {
  code: entry.result.code,
  dependencies: entry.dependencies,
  kind: "code"
};
const fromPersistedTransformResult = (result) => ({
  dependencies: result.dependencies,
  result: result.kind === "null" ? null : {
    code: result.code,
    map: null
  }
});
function resolveFileSystemCacheOptions(options, rootDir) {
  const normalizedOptions = normalizeFileSystemCacheOptions(
    options.fileSystemCache
  );
  if (!normalizedOptions) {
    return {
      directory: path.resolve(rootDir, DEFAULT_FILE_SYSTEM_CACHE_DIRECTORY),
      enabled: false
    };
  }
  return {
    directory: path.resolve(
      rootDir,
      normalizedOptions.directory ?? DEFAULT_FILE_SYSTEM_CACHE_DIRECTORY
    ),
    enabled: normalizedOptions.enabled ?? true
  };
}
function createFileSystemCacheNamespace(options, rootDir) {
  const { fileSystemCache, ...cacheKeyOptions } = options;
  const moduleDirectory = getCurrentModuleDirectory();
  const tsconfigPath = !options.compilerOptions && existsSync(
    resolveTsconfigPath$1(rootDir, options.tsconfigPath ?? "tsconfig.json")
  ) ? resolveTsconfigPath$1(rootDir, options.tsconfigPath ?? "tsconfig.json") : void 0;
  const tsconfigContents = tsconfigPath ? readFileSync(tsconfigPath, "utf-8") : void 0;
  const packageVersions = {
    plugin: resolvePluginPackageVersion(),
    reactDocgenTypescript: resolvePackageVersion("react-docgen-typescript", [
      rootDir,
      moduleDirectory
    ]),
    typescript: resolvePackageVersion("typescript", [rootDir, moduleDirectory])
  };
  return hashValue(
    stableStringify({
      cacheKeyOptions,
      packageVersions,
      rootDir,
      tsconfigContents,
      tsconfigPath,
      version: FILE_SYSTEM_CACHE_VERSION
    })
  );
}
function readFileSystemTransformCache(directory, normalizedFileId, source) {
  const cacheFilePath = getPersistedTransformResultPath(
    directory,
    normalizedFileId,
    source
  );
  if (!existsSync(cacheFilePath)) {
    return void 0;
  }
  const parsedCacheResult = JSON.parse(
    readFileSync(cacheFilePath, "utf-8")
  );
  return fromPersistedTransformResult(parsedCacheResult);
}
function writeFileSystemTransformCache(directory, normalizedFileId, source, entry) {
  mkdirSync(directory, { recursive: true });
  writeFileSync(
    getPersistedTransformResultPath(directory, normalizedFileId, source),
    JSON.stringify(toPersistedTransformResult(entry))
  );
}
function deleteFileSystemTransformCache(directory, normalizedFileId, source) {
  rmSync(getPersistedTransformResultPath(directory, normalizedFileId, source), {
    force: true
  });
}
function clearFileSystemTransformCache(directory) {
  rmSync(directory, {
    force: true,
    recursive: true
  });
}

const defaultPropFilter = (prop) => {
  return !prop.parent?.fileName.includes("node_modules");
};

const IDENTIFIER_PATH_PATTERN = /^[$A-Z_a-z][$\w]*(?:\.[$A-Z_a-z][$\w]*)*$/;
const getNodeModifiers = (node) => "modifiers" in node ? node.modifiers : void 0;
const hasModifier = (node, modifierKind) => Boolean(
  getNodeModifiers(node)?.some((modifier) => modifier.kind === modifierKind)
);
const isSupportedTargetExpression = (value) => IDENTIFIER_PATH_PATTERN.test(value);
const getExpressionTargetText = (expression, sourceFile, tsModule) => {
  if (tsModule.isIdentifier(expression)) {
    return expression.text;
  }
  if (tsModule.isPropertyAccessExpression(expression)) {
    const targetExpression = expression.getText(sourceFile);
    return isSupportedTargetExpression(targetExpression) ? targetExpression : null;
  }
  return null;
};
const getDeclarationTarget = (declaration, sourceFile, tsModule) => {
  if (tsModule.isVariableDeclaration(declaration) && tsModule.isIdentifier(declaration.name)) {
    return declaration.name.text;
  }
  if ((tsModule.isFunctionDeclaration(declaration) || tsModule.isClassDeclaration(declaration)) && declaration.name) {
    return declaration.name.text;
  }
  if (tsModule.isExportAssignment(declaration)) {
    return getExpressionTargetText(
      declaration.expression,
      sourceFile,
      tsModule
    );
  }
  if (tsModule.isExportSpecifier(declaration) && declaration.parent.parent.getSourceFile() === sourceFile) {
    return declaration.propertyName?.text ?? declaration.name.text;
  }
  return null;
};
const getTargetFromSymbol = (symbol, checker, sourceFile, tsModule) => {
  const candidateSymbols = [symbol];
  if (symbol.flags & tsModule.SymbolFlags.Alias) {
    try {
      candidateSymbols.unshift(checker.getAliasedSymbol(symbol));
    } catch {
    }
  }
  for (const candidateSymbol of candidateSymbols) {
    const declarations = candidateSymbol.declarations ?? (candidateSymbol.valueDeclaration ? [candidateSymbol.valueDeclaration] : []);
    for (const declaration of declarations) {
      if (declaration.getSourceFile() !== sourceFile) {
        continue;
      }
      const targetExpression = getDeclarationTarget(
        declaration,
        sourceFile,
        tsModule
      );
      if (targetExpression && isSupportedTargetExpression(targetExpression)) {
        return targetExpression;
      }
    }
  }
  return null;
};
const getDeclarationStatementTarget = (statement, tsModule) => {
  if (tsModule.isVariableStatement(statement)) {
    const targets = [];
    for (const declaration of statement.declarationList.declarations) {
      if (tsModule.isIdentifier(declaration.name)) {
        targets.push(declaration.name.text);
      }
    }
    return targets;
  }
  if ((tsModule.isFunctionDeclaration(statement) || tsModule.isClassDeclaration(statement)) && statement.name) {
    return [statement.name.text];
  }
  return [];
};
const getNamedExportTargets = (sourceFile, tsModule) => {
  const namedExportTargets = /* @__PURE__ */ new Set();
  for (const statement of sourceFile.statements) {
    if (hasModifier(statement, tsModule.SyntaxKind.ExportKeyword) && !hasModifier(statement, tsModule.SyntaxKind.DefaultKeyword)) {
      getDeclarationStatementTarget(statement, tsModule).forEach((target) => {
        namedExportTargets.add(target);
      });
    }
    if (tsModule.isExportDeclaration(statement) && statement.exportClause && tsModule.isNamedExports(statement.exportClause) && !statement.moduleSpecifier) {
      statement.exportClause.elements.forEach((element) => {
        if (element.name.text === "default") {
          return;
        }
        namedExportTargets.add(element.propertyName?.text ?? element.name.text);
      });
    }
  }
  return namedExportTargets;
};
const getDefaultExportTarget = (sourceFile, tsModule) => {
  for (const statement of sourceFile.statements) {
    if (tsModule.isExportAssignment(statement)) {
      return getExpressionTargetText(
        statement.expression,
        sourceFile,
        tsModule
      );
    }
    if ((tsModule.isFunctionDeclaration(statement) || tsModule.isClassDeclaration(statement)) && hasModifier(statement, tsModule.SyntaxKind.ExportKeyword) && hasModifier(statement, tsModule.SyntaxKind.DefaultKeyword) && statement.name) {
      return statement.name.text;
    }
    if (tsModule.isExportDeclaration(statement) && statement.exportClause && tsModule.isNamedExports(statement.exportClause) && !statement.moduleSpecifier) {
      const defaultSpecifier = statement.exportClause.elements.find(
        (element) => element.name.text === "default"
      );
      if (defaultSpecifier) {
        return defaultSpecifier.propertyName?.text ?? defaultSpecifier.name.text;
      }
    }
  }
  return null;
};
const getDefaultExportDisplayName = (fileName) => {
  const basename = path.basename(fileName, path.extname(fileName));
  const normalizedBasename = basename === "index" ? path.basename(path.dirname(fileName)) : basename;
  const identifier = normalizedBasename.replace(/^[^A-Z]*/gi, "").replace(/[^A-Z0-9]*/gi, "");
  return identifier.length ? identifier : "DefaultName";
};
const resolveTargetExpression = (componentDoc, checker, sourceFile, namedExportTargets, tsModule) => {
  if (componentDoc.expression) {
    const targetFromExpression = getTargetFromSymbol(
      componentDoc.expression,
      checker,
      sourceFile,
      tsModule
    );
    if (targetFromExpression) {
      return targetFromExpression;
    }
  }
  if (namedExportTargets.has(componentDoc.displayName)) {
    return componentDoc.displayName;
  }
  if (componentDoc.displayName.includes(".") && isSupportedTargetExpression(componentDoc.displayName)) {
    return componentDoc.displayName;
  }
  return null;
};
function resolveComponentDocRuntimeTargets(componentDocs, checker, sourceFile, tsModule) {
  const namedExportTargets = getNamedExportTargets(sourceFile, tsModule);
  const defaultExportTarget = getDefaultExportTarget(sourceFile, tsModule);
  const defaultExportDisplayName = getDefaultExportDisplayName(
    sourceFile.fileName
  );
  const usedTargets = /* @__PURE__ */ new Set();
  const resolvedComponentDocs = componentDocs.map((componentDoc) => {
    const targetExpression = resolveTargetExpression(
      componentDoc,
      checker,
      sourceFile,
      namedExportTargets,
      tsModule
    );
    if (targetExpression) {
      usedTargets.add(targetExpression);
    }
    return {
      ...componentDoc,
      targetExpression
    };
  });
  if (!defaultExportTarget || usedTargets.has(defaultExportTarget)) {
    return resolvedComponentDocs;
  }
  const unresolvedDocs = resolvedComponentDocs.filter(
    (componentDoc) => !componentDoc.targetExpression
  );
  const defaultExportDoc = unresolvedDocs.find(
    (componentDoc) => componentDoc.displayName === defaultExportDisplayName
  ) ?? (unresolvedDocs.length === 1 ? unresolvedDocs[0] : void 0);
  if (defaultExportDoc) {
    defaultExportDoc.targetExpression = defaultExportTarget;
  }
  return resolvedComponentDocs;
}

const DEFAULT_INCLUDE = ["**/*.tsx"];
const DEFAULT_EXCLUDE = ["**/*.stories.tsx"];
const DECLARATION_FILE_PATTERN = /\.d\.[cm]?ts$/;
const MAX_OPEN_PROJECT_SERVICE_FILES = 64;
const TYPESCRIPT_FILE_PATTERN = /\.[cm]?[jt]sx?$/;
const hasTsconfigPath = (project) => typeof project.tsconfigPath === "string";
const getDocgen = async (config, compilerOptions) => {
  const docGen = await import('react-docgen-typescript');
  const {
    compilerOptions: inlineCompilerOptions,
    exclude,
    include,
    fileSystemCache,
    propFilter = defaultPropFilter,
    setDisplayName,
    shouldIncludePropTagMap,
    tsconfigPath,
    typePropName,
    EXPERIMENTAL_useProjectService,
    EXPERIMENTAL_useWatchProgram,
    ...rest
  } = config;
  const docgenOptions = {
    propFilter,
    ...rest,
    shouldIncludeExpression: true,
    shouldIncludePropTagMap: shouldIncludePropTagMap ?? true
  };
  return docGen.withCompilerOptions(compilerOptions, docgenOptions);
};
const resolveTsconfigPath = (rootDir, tsconfigPath) => path.isAbsolute(tsconfigPath) ? tsconfigPath : path.resolve(rootDir, tsconfigPath);
const resolveRootFilesFromGlobs = async (rootDir, includeArray, excludeArray) => {
  const { globSync } = await import('glob');
  const files = /* @__PURE__ */ new Set();
  for (const filePattern of includeArray) {
    for (const fileName of globSync(filePattern, {
      absolute: true,
      cwd: rootDir,
      ignore: excludeArray,
      nodir: true
    })) {
      files.add(path.resolve(fileName));
    }
  }
  return [...files].sort();
};
const resolveProjectFilesFromParsedConfig = (parsedConfig) => parsedConfig.fileNames.map((fileName) => path.resolve(fileName));
const resolveProjectConfigFiles = (tsconfigPath, referencedConfigFiles) => tsconfigPath ? [
  .../* @__PURE__ */ new Set([path.resolve(tsconfigPath), ...referencedConfigFiles])
].sort() : [];
const resolveReferencedProjectMetadata = (typescriptModule, getTSConfigFile, projectReferences) => {
  const referencedConfigFiles = /* @__PURE__ */ new Set();
  const referencedProjectFiles = /* @__PURE__ */ new Set();
  const pendingProjectReferences = [...projectReferences ?? []];
  while (pendingProjectReferences.length > 0) {
    const projectReference = pendingProjectReferences.pop();
    if (!projectReference) {
      continue;
    }
    const referencedConfigPath = path.resolve(
      typescriptModule.resolveProjectReferencePath(projectReference)
    );
    if (referencedConfigFiles.has(referencedConfigPath)) {
      continue;
    }
    referencedConfigFiles.add(referencedConfigPath);
    const parsedReferencedConfig = getTSConfigFile(referencedConfigPath);
    for (const fileName of parsedReferencedConfig.fileNames) {
      referencedProjectFiles.add(path.resolve(fileName));
    }
    pendingProjectReferences.push(
      ...parsedReferencedConfig.projectReferences ?? []
    );
  }
  return {
    configFiles: [...referencedConfigFiles].sort(),
    projectFiles: [...referencedProjectFiles].sort()
  };
};
const resolveDocgenRootFiles = async (rootDir, includeArray, excludeArray, projectFiles) => {
  const matchedFiles = await resolveRootFilesFromGlobs(
    rootDir,
    includeArray,
    excludeArray
  );
  if (!projectFiles) {
    return matchedFiles;
  }
  const projectFileSet = new Set(projectFiles);
  const declarationFiles = projectFiles.filter(
    (fileName) => DECLARATION_FILE_PATTERN.test(fileName)
  );
  return [
    .../* @__PURE__ */ new Set([
      ...matchedFiles.filter((fileName) => projectFileSet.has(fileName)),
      ...declarationFiles
    ])
  ].sort();
};
const resolveTypescriptProject = async (config, rootDir) => {
  const { default: ts } = await import('typescript');
  const includeArray = config.include ?? DEFAULT_INCLUDE;
  const excludeArray = config.exclude ?? DEFAULT_EXCLUDE;
  let referencedProjectMetadata = {
    configFiles: [],
    projectFiles: []
  };
  let parsedConfig;
  let tsconfigPath;
  if (!config.compilerOptions) {
    const requestedTsconfigPath = config.tsconfigPath ?? "tsconfig.json";
    const absoluteTsconfigPath = resolveTsconfigPath(
      rootDir,
      requestedTsconfigPath
    );
    if (config.tsconfigPath || ts.sys.fileExists(absoluteTsconfigPath)) {
      const { getTSConfigFile } = await import('./chunks/typescript.mjs');
      parsedConfig = getTSConfigFile(absoluteTsconfigPath);
      referencedProjectMetadata = resolveReferencedProjectMetadata(
        ts,
        getTSConfigFile,
        parsedConfig.projectReferences
      );
      tsconfigPath = absoluteTsconfigPath;
    }
  }
  const compilerOptions = {
    jsx: ts.JsxEmit.React,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.Latest,
    ...parsedConfig?.options,
    ...config.compilerOptions
  };
  const projectFiles = parsedConfig ? [
    .../* @__PURE__ */ new Set([
      ...resolveProjectFilesFromParsedConfig(parsedConfig),
      ...referencedProjectMetadata.projectFiles
    ])
  ].sort() : await resolveRootFilesFromGlobs(rootDir, includeArray, excludeArray);
  const configFiles = resolveProjectConfigFiles(
    tsconfigPath,
    referencedProjectMetadata.configFiles
  );
  const rootFiles = parsedConfig ? await resolveDocgenRootFiles(
    rootDir,
    includeArray,
    excludeArray,
    projectFiles
  ) : projectFiles;
  return {
    compilerOptions,
    configFiles,
    projectFiles,
    projectName: tsconfigPath ?? path.join(rootDir, ".react-docgen-typescript.external-project"),
    projectReferences: parsedConfig?.projectReferences,
    rootFiles,
    tsconfigPath,
    watchOptions: parsedConfig?.watchOptions
  };
};
const createProgram = async (project, oldProgram) => {
  const { default: ts } = await import('typescript');
  const host = ts.createIncrementalCompilerHost(
    project.compilerOptions,
    ts.sys
  );
  return ts.createSemanticDiagnosticsBuilderProgram(
    project.rootFiles,
    project.compilerOptions,
    host,
    oldProgram,
    void 0,
    project.projectReferences
  );
};
const doNothing = () => {
};
const createStubFileWatcher = () => ({
  close: doNothing
});
const createProjectService = async (project) => {
  const { default: tsserver } = await import('typescript/lib/tsserverlibrary.js');
  const projectServiceRootFiles = project.tsconfigPath ? project.configFiles : project.rootFiles;
  const system = {
    ...tsserver.sys,
    clearImmediate,
    clearTimeout,
    setImmediate,
    setTimeout,
    watchDirectory: createStubFileWatcher,
    watchFile: createStubFileWatcher
  };
  const projectService = new tsserver.server.ProjectService({
    cancellationToken: { isCancellationRequested: () => false },
    host: system,
    jsDocParsingMode: 0,
    logger: {
      close: doNothing,
      endGroup: doNothing,
      getLogFileName: () => void 0,
      hasLevel: () => false,
      info: doNothing,
      loggingEnabled: () => false,
      msg: doNothing,
      perftrc: doNothing,
      startGroup: doNothing
    },
    session: void 0,
    useInferredProjectPerProjectRoot: false,
    useSingleInferredProject: false
  });
  projectService.setHostConfiguration({
    preferences: {
      lazyConfiguredProjectsFromExternalProject: true
    },
    watchOptions: project.watchOptions
  });
  projectService.openExternalProject({
    options: project.compilerOptions,
    projectFileName: project.projectName,
    rootFiles: projectServiceRootFiles.map((fileName) => ({ fileName }))
  });
  return projectService;
};
const closeProjectService = (projectService, projectName) => {
  projectService.closeExternalProject(projectName);
  projectService.close?.();
};
const startWatch = async (project, onProgramCreatedOrUpdated) => {
  const { default: ts } = await import('typescript');
  const reportWatchStatus = () => {
  };
  const startConfiguredWatch = (configuredProject) => {
    const host = ts.createWatchCompilerHost(
      configuredProject.tsconfigPath,
      configuredProject.compilerOptions,
      ts.sys,
      ts.createSemanticDiagnosticsBuilderProgram,
      void 0,
      reportWatchStatus,
      configuredProject.watchOptions
    );
    host.afterProgramCreate = (program) => {
      onProgramCreatedOrUpdated(program.getProgram());
    };
    const watch = ts.createWatchProgram(host);
    return [watch.getProgram().getProgram(), watch.close];
  };
  const startRootFilesWatch = () => {
    const host = ts.createWatchCompilerHost(
      project.rootFiles,
      project.compilerOptions,
      ts.sys,
      ts.createSemanticDiagnosticsBuilderProgram,
      void 0,
      reportWatchStatus,
      project.projectReferences,
      project.watchOptions
    );
    host.afterProgramCreate = (program) => {
      onProgramCreatedOrUpdated(program.getProgram());
    };
    const watch = ts.createWatchProgram(host);
    return [watch.getProgram().getProgram(), watch.close];
  };
  return new Promise((resolve) => {
    resolve(
      hasTsconfigPath(project) ? startConfiguredWatch(project) : startRootFilesWatch()
    );
  });
};
const cleanModuleId = (id) => id.split("?", 1)[0];
const getErrorMessage = (error) => error instanceof Error ? error.message : String(error);
const getProgramDependencyCache = (cacheByProgram, program) => {
  let dependencyCache = cacheByProgram.get(program);
  if (!dependencyCache) {
    dependencyCache = /* @__PURE__ */ new Map();
    cacheByProgram.set(program, dependencyCache);
  }
  return dependencyCache;
};
const collectDirectTrackedFileDependencies = (currentFileName, compilerOptions, directDependencyCache, moduleResolutionCache, program, trackedFiles, typeReferenceResolutionCache, typescriptModule) => {
  const currentFile = path.resolve(currentFileName);
  const cachedDependencies = directDependencyCache.get(currentFile);
  if (cachedDependencies) {
    return cachedDependencies;
  }
  const sourceFile = program.getSourceFile(currentFile);
  if (!sourceFile) {
    const missingFileDependencies = [];
    directDependencyCache.set(currentFile, missingFileDependencies);
    return missingFileDependencies;
  }
  const { importedFiles, referencedFiles, typeReferenceDirectives } = typescriptModule.preProcessFile(sourceFile.text, true, true);
  const referencedDependencyFiles = /* @__PURE__ */ new Set();
  for (const importedFile of importedFiles) {
    const resolvedModule = typescriptModule.resolveModuleName(
      importedFile.fileName,
      currentFile,
      compilerOptions,
      typescriptModule.sys,
      moduleResolutionCache
    ).resolvedModule;
    if (resolvedModule?.resolvedFileName) {
      referencedDependencyFiles.add(
        path.resolve(resolvedModule.resolvedFileName)
      );
    }
  }
  for (const referencedFile of referencedFiles) {
    referencedDependencyFiles.add(
      path.resolve(path.dirname(currentFile), referencedFile.fileName)
    );
  }
  for (const typeReferenceDirective of typeReferenceDirectives) {
    const resolvedTypeReference = typescriptModule.resolveTypeReferenceDirective(
      typeReferenceDirective.fileName,
      currentFile,
      compilerOptions,
      typescriptModule.sys,
      void 0,
      typeReferenceResolutionCache
    ).resolvedTypeReferenceDirective;
    if (resolvedTypeReference?.resolvedFileName) {
      referencedDependencyFiles.add(
        path.resolve(resolvedTypeReference.resolvedFileName)
      );
    }
  }
  const directDependencies = [...referencedDependencyFiles].filter((dependencyFile) => trackedFiles.has(dependencyFile)).sort();
  directDependencyCache.set(currentFile, directDependencies);
  return directDependencies;
};
const collectTrackedFileDependencies = (entryFileName, compilerOptions, dependencyClosureCacheByProgram, directDependencyCacheByProgram, moduleResolutionCache, program, trackedFiles, typeReferenceResolutionCache, typescriptModule) => {
  const directDependencyCache = getProgramDependencyCache(
    directDependencyCacheByProgram,
    program
  );
  const dependencyClosureCache = getProgramDependencyCache(
    dependencyClosureCacheByProgram,
    program
  );
  const pendingFiles = /* @__PURE__ */ new Set();
  const visit = (currentFileName) => {
    const currentFile = path.resolve(currentFileName);
    const cachedDependencies = dependencyClosureCache.get(currentFile);
    if (cachedDependencies) {
      return cachedDependencies;
    }
    if (pendingFiles.has(currentFile)) {
      return [currentFile];
    }
    pendingFiles.add(currentFile);
    const dependencyFiles = /* @__PURE__ */ new Set([currentFile]);
    const directDependencies = collectDirectTrackedFileDependencies(
      currentFile,
      compilerOptions,
      directDependencyCache,
      moduleResolutionCache,
      program,
      trackedFiles,
      typeReferenceResolutionCache,
      typescriptModule
    );
    for (const directDependency of directDependencies) {
      dependencyFiles.add(directDependency);
      for (const transitiveDependency of visit(directDependency)) {
        dependencyFiles.add(transitiveDependency);
      }
    }
    pendingFiles.delete(currentFile);
    const resolvedDependencies = [...dependencyFiles].sort();
    dependencyClosureCache.set(currentFile, resolvedDependencies);
    return resolvedDependencies;
  };
  return visit(entryFileName);
};
function reactDocgenTypescript(config = {}) {
  const runtimeMode = config.EXPERIMENTAL_useProjectService ? "projectService" : config.EXPERIMENTAL_useWatchProgram ? "watch" : "default";
  let configRoot = process.cwd();
  let project;
  let shouldEagerInitialize = false;
  let initializationPromise = null;
  let tsProgram;
  let reusableTsBuilderProgram;
  let moduleResolutionCache;
  let typeReferenceResolutionCache;
  let typescriptModule = null;
  let docGenParser;
  let generateDocgenCodeBlock;
  let generateOptions;
  let filter;
  let fileSystemCacheDirectory = null;
  const moduleInvalidationQueue = /* @__PURE__ */ new Map();
  const moduleDependencies = /* @__PURE__ */ new Map();
  const moduleFilesByDependency = /* @__PURE__ */ new Map();
  let pendingWatchProgramUpdate;
  let dependencyClosureCacheByProgram = /* @__PURE__ */ new WeakMap();
  let directDependencyCacheByProgram = /* @__PURE__ */ new WeakMap();
  const projectConfigFiles = /* @__PURE__ */ new Set();
  const projectRootFiles = /* @__PURE__ */ new Set();
  const projectTrackedFiles = /* @__PURE__ */ new Set();
  let syncedProjectFilesProgram;
  const transformedModuleFiles = /* @__PURE__ */ new Set();
  const transformCache = /* @__PURE__ */ new Map();
  const warnedMessages = /* @__PURE__ */ new Set();
  let closeWatch;
  let didDispose = false;
  let projectService = null;
  const openProjectServiceFiles = /* @__PURE__ */ new Map();
  const projectServiceProjectsByFile = /* @__PURE__ */ new Map();
  const clearTransformCache = () => {
    transformCache.clear();
  };
  const clearDependencyAnalysisCache = () => {
    dependencyClosureCacheByProgram = /* @__PURE__ */ new WeakMap();
    directDependencyCacheByProgram = /* @__PURE__ */ new WeakMap();
  };
  const clearTrackedModuleDependencies = (moduleFile) => {
    const trackedDependencies = moduleDependencies.get(moduleFile);
    if (!trackedDependencies) {
      return;
    }
    for (const dependencyFile of trackedDependencies) {
      const dependentModuleFiles = moduleFilesByDependency.get(dependencyFile);
      dependentModuleFiles?.delete(moduleFile);
      if (dependentModuleFiles?.size === 0) {
        moduleFilesByDependency.delete(dependencyFile);
      }
    }
    moduleDependencies.delete(moduleFile);
  };
  const clearAllTrackedModuleDependencies = () => {
    moduleDependencies.clear();
    moduleFilesByDependency.clear();
  };
  const trackModuleDependencies = (moduleFile, dependencies) => {
    transformedModuleFiles.add(moduleFile);
    clearTrackedModuleDependencies(moduleFile);
    if (!dependencies || dependencies.length === 0) {
      return;
    }
    const normalizedDependencies = new Set(
      dependencies.map((dependencyFile) => path.resolve(dependencyFile))
    );
    normalizedDependencies.add(moduleFile);
    moduleDependencies.set(moduleFile, normalizedDependencies);
    for (const dependencyFile of normalizedDependencies) {
      const dependentModuleFiles = moduleFilesByDependency.get(dependencyFile) ?? /* @__PURE__ */ new Set();
      dependentModuleFiles.add(moduleFile);
      moduleFilesByDependency.set(dependencyFile, dependentModuleFiles);
    }
  };
  const getAffectedTransformedModuleFiles = (dependencyFile) => new Set(moduleFilesByDependency.get(dependencyFile) ?? []);
  const clearPendingWatchProgramUpdate = () => {
    pendingWatchProgramUpdate?.resolve();
    pendingWatchProgramUpdate = void 0;
  };
  const queuePendingWatchProgramUpdate = (affectedModuleFiles, changedFile) => {
    if (!pendingWatchProgramUpdate) {
      let resolvePendingWatchProgramUpdate;
      const promise = new Promise((resolve) => {
        resolvePendingWatchProgramUpdate = resolve;
      });
      pendingWatchProgramUpdate = {
        affectedModuleFiles: /* @__PURE__ */ new Set(),
        changedFiles: /* @__PURE__ */ new Set(),
        promise,
        resolve: () => {
          resolvePendingWatchProgramUpdate?.();
        }
      };
    }
    for (const affectedModuleFile of affectedModuleFiles) {
      pendingWatchProgramUpdate.affectedModuleFiles.add(affectedModuleFile);
    }
    pendingWatchProgramUpdate.changedFiles.add(changedFile);
  };
  const waitForPendingWatchProgramUpdate = async (fileName) => {
    if (!pendingWatchProgramUpdate?.affectedModuleFiles.has(fileName)) {
      return;
    }
    await pendingWatchProgramUpdate.promise;
  };
  const isPendingWatchProgramUpdateReady = (program) => {
    if (!pendingWatchProgramUpdate) {
      return true;
    }
    for (const changedFile of pendingWatchProgramUpdate.changedFiles) {
      if (!existsSync(changedFile)) {
        continue;
      }
      const sourceFile = program.getSourceFile(changedFile);
      if (!sourceFile) {
        return false;
      }
      if (sourceFile.text !== readFileSync(changedFile, "utf-8")) {
        return false;
      }
    }
    return true;
  };
  const clearPersistentCache = () => {
    if (!fileSystemCacheDirectory) {
      return;
    }
    try {
      clearFileSystemTransformCache(fileSystemCacheDirectory);
    } catch {
    }
  };
  const clearProjectServiceProjectCache = () => {
    projectServiceProjectsByFile.clear();
  };
  const closeProjectServiceClientFile = (fileName) => {
    if (!openProjectServiceFiles.has(fileName)) {
      return;
    }
    projectService?.closeClientFile(fileName);
    openProjectServiceFiles.delete(fileName);
    projectServiceProjectsByFile.delete(fileName);
  };
  const closeAllProjectServiceClientFiles = () => {
    for (const fileName of [...openProjectServiceFiles.keys()]) {
      closeProjectServiceClientFile(fileName);
    }
  };
  const touchProjectServiceOpenFile = (fileName) => {
    const currentState = openProjectServiceFiles.get(fileName);
    if (!currentState) {
      return;
    }
    openProjectServiceFiles.delete(fileName);
    openProjectServiceFiles.set(fileName, currentState);
  };
  const pruneProjectServiceOpenFiles = (preserveFile) => {
    while (openProjectServiceFiles.size > MAX_OPEN_PROJECT_SERVICE_FILES) {
      let fileToClose;
      for (const openFileName of openProjectServiceFiles.keys()) {
        if (openFileName !== preserveFile) {
          fileToClose = openFileName;
          break;
        }
      }
      if (!fileToClose) {
        return;
      }
      closeProjectServiceClientFile(fileToClose);
    }
  };
  const openProjectServiceClientFile = (fileName, source) => {
    if (!projectService) {
      throw new Error("Internal error: project service was not initialized");
    }
    const currentState = openProjectServiceFiles.get(fileName);
    if (currentState?.source !== source) {
      projectService.openClientFile(
        fileName,
        source,
        /* scriptKind */
        void 0,
        configRoot
      );
      projectServiceProjectsByFile.delete(fileName);
    }
    openProjectServiceFiles.delete(fileName);
    openProjectServiceFiles.set(fileName, { source });
    pruneProjectServiceOpenFiles(fileName);
  };
  const syncProjectServiceFileFromDisk = (fileName) => {
    if (!projectService) {
      return false;
    }
    if (!existsSync(fileName)) {
      closeProjectServiceClientFile(fileName);
      return false;
    }
    const source = readFileSync(fileName, "utf-8");
    const wasAlreadyOpen = openProjectServiceFiles.has(fileName);
    projectService.openClientFile(
      fileName,
      source,
      /* scriptKind */
      void 0,
      configRoot
    );
    projectServiceProjectsByFile.delete(fileName);
    if (wasAlreadyOpen) {
      openProjectServiceFiles.delete(fileName);
      openProjectServiceFiles.set(fileName, { source });
      pruneProjectServiceOpenFiles(fileName);
    }
    return !wasAlreadyOpen;
  };
  const reloadProjectService = () => {
    if (!projectService) {
      return;
    }
    clearProjectServiceProjectCache();
    projectService.reloadProjects();
  };
  const refreshProjectServiceProjects = (changedFile, affectedModuleFiles) => {
    if (!projectService) {
      return;
    }
    const affectedProjects = /* @__PURE__ */ new Set();
    const addProject = (nextProject) => {
      if (nextProject && !nextProject.isClosed()) {
        affectedProjects.add(nextProject);
      }
    };
    addProject(projectServiceProjectsByFile.get(changedFile));
    for (const affectedModuleFile of affectedModuleFiles) {
      addProject(projectServiceProjectsByFile.get(affectedModuleFile));
    }
    if (affectedProjects.size === 0) {
      const scriptInfo = projectService.getScriptInfo(changedFile);
      if (scriptInfo?.fileName) {
        addProject(
          projectService.getDefaultProjectForFile(scriptInfo.fileName, true)
        );
      }
    }
    if (affectedProjects.size === 0) {
      reloadProjectService();
      return;
    }
    try {
      for (const [
        cachedFileName,
        cachedProject
      ] of projectServiceProjectsByFile) {
        if (cachedFileName === changedFile || affectedProjects.has(cachedProject)) {
          projectServiceProjectsByFile.delete(cachedFileName);
        }
      }
      for (const affectedProject of affectedProjects) {
        affectedProject.registerFileUpdate(changedFile);
        affectedProject.updateGraph();
      }
    } catch {
      reloadProjectService();
    }
  };
  const getProjectServiceProgram = (fileName, source) => {
    if (!projectService) {
      return void 0;
    }
    openProjectServiceClientFile(fileName, source);
    const scriptInfo = projectService.getScriptInfo(fileName);
    if (!scriptInfo?.fileName) {
      return void 0;
    }
    const cachedProject = projectServiceProjectsByFile.get(fileName);
    if (cachedProject && !cachedProject.isClosed() && cachedProject.containsScriptInfo(scriptInfo)) {
      const cachedProgram = cachedProject.getLanguageService(true).getProgram();
      if (cachedProgram) {
        touchProjectServiceOpenFile(fileName);
        return cachedProgram;
      }
    }
    const nextProject = projectService.getDefaultProjectForFile(
      scriptInfo.fileName,
      true
    );
    if (!nextProject) {
      return void 0;
    }
    projectServiceProjectsByFile.set(fileName, nextProject);
    touchProjectServiceOpenFile(fileName);
    return nextProject.getLanguageService(true).getProgram();
  };
  const hasRuntimeState = () => runtimeMode === "projectService" ? projectService !== null : runtimeMode === "watch" ? tsProgram !== void 0 && closeWatch !== void 0 : tsProgram !== void 0;
  const syncProjectFiles = (target, fileNames) => {
    target.clear();
    for (const fileName of fileNames) {
      target.add(path.resolve(fileName));
    }
  };
  const collectProjectConfigFilesFromProgram = (nextProject, program) => {
    const nextConfigFiles = new Set(
      nextProject.configFiles.map((fileName) => path.resolve(fileName))
    );
    const pendingProjectReferences = [
      ...program.getResolvedProjectReferences() ?? []
    ];
    while (pendingProjectReferences.length > 0) {
      const resolvedProjectReference = pendingProjectReferences.pop();
      if (!resolvedProjectReference) {
        continue;
      }
      nextConfigFiles.add(
        path.resolve(resolvedProjectReference.sourceFile.fileName)
      );
      pendingProjectReferences.push(
        ...resolvedProjectReference.references ?? []
      );
    }
    return [...nextConfigFiles].sort();
  };
  const collectTrackedProjectFilesFromProgram = (nextProject, program) => {
    const nextTrackedFiles = new Set(
      nextProject.projectFiles.map((fileName) => path.resolve(fileName))
    );
    for (const sourceFile of program.getSourceFiles()) {
      if (program.isSourceFileDefaultLibrary(sourceFile)) {
        continue;
      }
      nextTrackedFiles.add(path.resolve(sourceFile.fileName));
    }
    const pendingProjectReferences = [
      ...program.getResolvedProjectReferences() ?? []
    ];
    while (pendingProjectReferences.length > 0) {
      const resolvedProjectReference = pendingProjectReferences.pop();
      if (!resolvedProjectReference) {
        continue;
      }
      for (const fileName of resolvedProjectReference.commandLine.fileNames) {
        nextTrackedFiles.add(path.resolve(fileName));
      }
      pendingProjectReferences.push(
        ...resolvedProjectReference.references ?? []
      );
    }
    return [...nextTrackedFiles].sort();
  };
  const syncTrackedProjectFiles = (nextProject) => {
    syncedProjectFilesProgram = void 0;
    syncProjectFiles(projectConfigFiles, nextProject.configFiles);
    projectRootFiles.clear();
    syncProjectFiles(projectRootFiles, nextProject.rootFiles);
    syncProjectFiles(projectTrackedFiles, nextProject.projectFiles);
  };
  const syncProjectFilesFromProgram = (nextProject, program) => {
    if (syncedProjectFilesProgram === program) {
      return;
    }
    syncedProjectFilesProgram = program;
    syncProjectFiles(
      projectConfigFiles,
      collectProjectConfigFilesFromProgram(nextProject, program)
    );
    syncProjectFiles(
      projectTrackedFiles,
      collectTrackedProjectFilesFromProgram(nextProject, program)
    );
  };
  const closeRuntimeState = ({
    preserveReusableProgram = false
  } = {}) => {
    clearPendingWatchProgramUpdate();
    closeWatch?.();
    closeWatch = void 0;
    if (projectService && project) {
      closeAllProjectServiceClientFiles();
      clearProjectServiceProjectCache();
      closeProjectService(projectService, project.projectName);
    }
    projectService = null;
    if (!preserveReusableProgram) {
      reusableTsBuilderProgram = void 0;
    }
    syncedProjectFilesProgram = void 0;
    tsProgram = void 0;
  };
  const clearProjectContext = () => {
    project = void 0;
    docGenParser = void 0;
    clearDependencyAnalysisCache();
    clearAllTrackedModuleDependencies();
    clearProjectServiceProjectCache();
    moduleResolutionCache = void 0;
    openProjectServiceFiles.clear();
    syncedProjectFilesProgram = void 0;
    projectConfigFiles.clear();
    projectRootFiles.clear();
    projectTrackedFiles.clear();
    reusableTsBuilderProgram = void 0;
    typeReferenceResolutionCache = void 0;
  };
  const invalidateTransformedModules = (server, affectedTransformedModuleFiles, queueInvalidation = false) => {
    for (const transformedModuleFile of affectedTransformedModuleFiles) {
      const affectedModules = server.moduleGraph.getModulesByFile(
        transformedModuleFile
      );
      if (!affectedModules) {
        continue;
      }
      for (const module of affectedModules) {
        const key = module.id ?? module.url;
        const invalidateModule = () => {
          server.moduleGraph.invalidateModule(
            module,
            void 0,
            Date.now(),
            true
          );
        };
        if (queueInvalidation) {
          moduleInvalidationQueue.set(key, invalidateModule);
        } else {
          invalidateModule();
        }
      }
    }
  };
  const flushQueuedModuleInvalidations = () => {
    for (const [
      filepath,
      invalidateModule
    ] of moduleInvalidationQueue.entries()) {
      invalidateModule();
      moduleInvalidationQueue.delete(filepath);
    }
  };
  const deleteCachedTransforms = (pluginContext, affectedModuleFiles) => {
    for (const affectedModuleFile of affectedModuleFiles) {
      const cachedTransform = transformCache.get(affectedModuleFile);
      if (fileSystemCacheDirectory && cachedTransform) {
        try {
          deleteFileSystemTransformCache(
            fileSystemCacheDirectory,
            affectedModuleFile,
            cachedTransform.source
          );
        } catch (error) {
          warnOnce(
            pluginContext,
            `${fileSystemCacheDirectory}:file-system-cache-delete:${affectedModuleFile}:${getErrorMessage(error)}`,
            `Failed to delete the docgen file-system cache entry for "${affectedModuleFile}" at "${fileSystemCacheDirectory}": ${getErrorMessage(error)}`
          );
        }
      }
      transformCache.delete(affectedModuleFile);
    }
  };
  const ensureInitialized = async () => {
    if (project && docGenParser && hasRuntimeState()) {
      return;
    }
    if (initializationPromise) {
      await initializationPromise;
      return;
    }
    initializationPromise = (async () => {
      typescriptModule ??= (await import('typescript')).default;
      if (!project || !docGenParser) {
        project = await resolveTypescriptProject(config, configRoot);
        docGenParser = await getDocgen(config, project.compilerOptions);
        moduleResolutionCache = typescriptModule.createModuleResolutionCache(
          configRoot,
          typescriptModule.sys.useCaseSensitiveFileNames ? (fileName) => fileName : (fileName) => fileName.toLowerCase(),
          project.compilerOptions
        );
        typeReferenceResolutionCache = typescriptModule.createTypeReferenceDirectiveResolutionCache(
          configRoot,
          typescriptModule.sys.useCaseSensitiveFileNames ? (fileName) => fileName : (fileName) => fileName.toLowerCase(),
          project.compilerOptions
        );
        clearDependencyAnalysisCache();
        syncTrackedProjectFiles(project);
        clearTransformCache();
      }
      const activeProject = project;
      if (runtimeMode === "projectService") {
        if (!projectService) {
          projectService = await createProjectService(activeProject);
        }
      } else if (runtimeMode === "watch") {
        if (!tsProgram || !closeWatch) {
          [tsProgram, closeWatch] = await startWatch(
            activeProject,
            (program) => {
              clearDependencyAnalysisCache();
              reusableTsBuilderProgram = void 0;
              tsProgram = program;
              syncProjectFilesFromProgram(activeProject, program);
              if (isPendingWatchProgramUpdateReady(program)) {
                flushQueuedModuleInvalidations();
                clearPendingWatchProgramUpdate();
              }
            }
          );
          syncProjectFilesFromProgram(activeProject, tsProgram);
        }
      } else if (!tsProgram) {
        reusableTsBuilderProgram = await createProgram(
          activeProject,
          reusableTsBuilderProgram
        );
        tsProgram = reusableTsBuilderProgram.getProgram();
        syncProjectFilesFromProgram(activeProject, tsProgram);
      }
    })();
    try {
      await initializationPromise;
    } finally {
      initializationPromise = null;
    }
  };
  const teardown = () => {
    if (didDispose) {
      return;
    }
    didDispose = true;
    initializationPromise = null;
    clearDependencyAnalysisCache();
    clearTransformCache();
    clearAllTrackedModuleDependencies();
    transformedModuleFiles.clear();
    moduleInvalidationQueue.clear();
    closeRuntimeState();
    clearProjectContext();
  };
  const warnOnce = (pluginContext, key, message) => {
    if (warnedMessages.has(key)) {
      return;
    }
    warnedMessages.add(key);
    pluginContext.warn(message);
  };
  const readCachedTransform = (pluginContext, normalizedFileId, source) => {
    if (!fileSystemCacheDirectory) {
      return void 0;
    }
    try {
      const cachedTransform = readFileSystemTransformCache(
        fileSystemCacheDirectory,
        normalizedFileId,
        source
      );
      return cachedTransform ? {
        dependencies: cachedTransform.dependencies,
        result: cachedTransform.result
      } : void 0;
    } catch (error) {
      warnOnce(
        pluginContext,
        `${fileSystemCacheDirectory}:file-system-cache-read:${getErrorMessage(error)}`,
        `Failed to read the docgen file-system cache at "${fileSystemCacheDirectory}": ${getErrorMessage(error)}`
      );
      return void 0;
    }
  };
  const writeCachedTransform = (pluginContext, normalizedFileId, source, dependencies, result) => {
    if (!fileSystemCacheDirectory) {
      return;
    }
    try {
      writeFileSystemTransformCache(
        fileSystemCacheDirectory,
        normalizedFileId,
        source,
        {
          dependencies: dependencies ? [...dependencies] : void 0,
          result
        }
      );
    } catch (error) {
      warnOnce(
        pluginContext,
        `${fileSystemCacheDirectory}:file-system-cache-write:${getErrorMessage(error)}`,
        `Failed to write the docgen file-system cache at "${fileSystemCacheDirectory}": ${getErrorMessage(error)}`
      );
    }
  };
  return {
    name: "vite:react-docgen-typescript",
    async configResolved(resolvedConfig) {
      const { getGenerateOptions } = await import('./chunks/options.mjs');
      generateDocgenCodeBlock = (await import('./chunks/generate.mjs')).generateDocgenCodeBlock;
      const { createFilter } = await import('vite');
      configRoot = resolvedConfig?.root ?? process.cwd();
      shouldEagerInitialize = resolvedConfig?.command === "build";
      generateOptions = getGenerateOptions(config);
      const resolvedFileSystemCache = resolveFileSystemCacheOptions(
        config,
        configRoot
      );
      fileSystemCacheDirectory = resolvedFileSystemCache.enabled ? path.join(
        resolvedFileSystemCache.directory,
        createFileSystemCacheNamespace(config, configRoot)
      ) : null;
      if (config.tsconfigPath) {
        const absoluteTsconfigPath = resolveTsconfigPath(
          configRoot,
          config.tsconfigPath
        );
        if (!existsSync(absoluteTsconfigPath)) {
          throw new Error(
            `Failed to read tsconfig at "${absoluteTsconfigPath}": File does not exist`
          );
        }
      }
      const includeArray = config.include ?? DEFAULT_INCLUDE;
      const excludeArray = config.exclude ?? DEFAULT_EXCLUDE;
      filter = createFilter(includeArray, excludeArray);
      if (shouldEagerInitialize) {
        await ensureInitialized();
      }
    },
    async transform(src, id) {
      const fileId = cleanModuleId(id);
      if (!filter(fileId)) {
        return;
      }
      const normalizedFileId = path.resolve(fileId);
      await waitForPendingWatchProgramUpdate(normalizedFileId);
      const cachedTransform = transformCache.get(normalizedFileId);
      if (cachedTransform?.source === src) {
        touchProjectServiceOpenFile(normalizedFileId);
        trackModuleDependencies(normalizedFileId, cachedTransform.dependencies);
        return cachedTransform.result;
      }
      const persistedCachedTransform = readCachedTransform(
        this,
        normalizedFileId,
        src
      );
      if (persistedCachedTransform !== void 0) {
        touchProjectServiceOpenFile(normalizedFileId);
        transformCache.set(normalizedFileId, {
          dependencies: persistedCachedTransform.dependencies,
          result: persistedCachedTransform.result,
          source: src
        });
        trackModuleDependencies(
          normalizedFileId,
          persistedCachedTransform.dependencies
        );
        return persistedCachedTransform.result;
      }
      await ensureInitialized();
      const activeDocGenParser = docGenParser;
      if (!projectRootFiles.has(normalizedFileId)) {
        trackModuleDependencies(normalizedFileId, void 0);
        warnOnce(
          this,
          `${normalizedFileId}:excluded-from-typescript-project`,
          `Skipping docgen for "${normalizedFileId}" because it is not included in the active TypeScript project.`
        );
        return src;
      }
      let activeProgram;
      try {
        if (!activeDocGenParser) {
          throw new Error("Internal error: docgen parser was not initialized");
        }
        const componentDocs = activeDocGenParser.parseWithProgramProvider(
          normalizedFileId,
          () => {
            if (tsProgram) {
              activeProgram = tsProgram;
              return tsProgram;
            }
            if (projectService) {
              const languageServiceProgram = getProjectServiceProgram(
                normalizedFileId,
                src
              );
              if (languageServiceProgram) {
                activeProgram = languageServiceProgram;
                return languageServiceProgram;
              }
            }
            throw new Error("Internal error: no TypeScript program available");
          }
        );
        if (activeProgram && project) {
          syncProjectFilesFromProgram(project, activeProgram);
        }
        const trackedDependencies = activeProgram && project && typescriptModule ? collectTrackedFileDependencies(
          normalizedFileId,
          project.compilerOptions,
          dependencyClosureCacheByProgram,
          directDependencyCacheByProgram,
          moduleResolutionCache,
          activeProgram,
          projectTrackedFiles,
          typeReferenceResolutionCache,
          typescriptModule
        ) : void 0;
        if (!componentDocs.length) {
          const result2 = null;
          transformCache.set(normalizedFileId, {
            dependencies: trackedDependencies,
            result: result2,
            source: src
          });
          trackModuleDependencies(normalizedFileId, trackedDependencies);
          writeCachedTransform(
            this,
            normalizedFileId,
            src,
            trackedDependencies,
            result2
          );
          return null;
        }
        const componentDocsWithTargets = activeProgram && typescriptModule ? resolveComponentDocRuntimeTargets(
          componentDocs,
          activeProgram.getTypeChecker(),
          activeProgram.getSourceFile(normalizedFileId) ?? (() => {
            throw new Error(
              `Internal error: source file "${normalizedFileId}" was not found in the active TypeScript program`
            );
          })(),
          typescriptModule
        ) : componentDocs.map((componentDoc) => ({
          ...componentDoc,
          targetExpression: null
        }));
        const result = generateDocgenCodeBlock({
          filename: normalizedFileId,
          source: src,
          componentDocs: componentDocsWithTargets,
          ...generateOptions
        });
        transformCache.set(normalizedFileId, {
          dependencies: trackedDependencies,
          result,
          source: src
        });
        trackModuleDependencies(normalizedFileId, trackedDependencies);
        writeCachedTransform(
          this,
          normalizedFileId,
          src,
          trackedDependencies,
          result
        );
        return result;
      } catch (error) {
        const trackedDependencies = activeProgram && project && typescriptModule ? collectTrackedFileDependencies(
          normalizedFileId,
          project.compilerOptions,
          dependencyClosureCacheByProgram,
          directDependencyCacheByProgram,
          moduleResolutionCache,
          activeProgram,
          projectTrackedFiles,
          typeReferenceResolutionCache,
          typescriptModule
        ) : void 0;
        warnOnce(
          this,
          `${normalizedFileId}:${getErrorMessage(error)}`,
          `Failed to generate docgen for "${normalizedFileId}": ${getErrorMessage(error)}`
        );
        trackModuleDependencies(normalizedFileId, trackedDependencies);
        return src;
      }
    },
    async handleHotUpdate({ file, server }) {
      const normalizedFile = path.resolve(cleanModuleId(file));
      const isPotentialTypescriptFile = TYPESCRIPT_FILE_PATTERN.test(normalizedFile);
      const isTsconfigChange = projectConfigFiles.has(normalizedFile);
      const isTrackedTypescriptFile = project ? isTsconfigChange || projectTrackedFiles.has(normalizedFile) || !project.tsconfigPath && isPotentialTypescriptFile : isPotentialTypescriptFile;
      const affectedTransformedModuleFiles = isTsconfigChange ? new Set(transformedModuleFiles) : getAffectedTransformedModuleFiles(normalizedFile);
      if (!isTrackedTypescriptFile) return;
      if (isTsconfigChange) {
        clearDependencyAnalysisCache();
        clearTransformCache();
        clearPersistentCache();
        closeRuntimeState();
        clearProjectContext();
        invalidateTransformedModules(server, transformedModuleFiles);
        return;
      }
      clearDependencyAnalysisCache();
      deleteCachedTransforms(this, affectedTransformedModuleFiles);
      if (runtimeMode === "watch") {
        if (!project || !hasRuntimeState()) return;
        queuePendingWatchProgramUpdate(
          affectedTransformedModuleFiles,
          normalizedFile
        );
        invalidateTransformedModules(
          server,
          affectedTransformedModuleFiles,
          true
        );
        return;
      }
      if (runtimeMode === "projectService") {
        if (projectService) {
          const shouldCloseTemporaryClientFile = syncProjectServiceFileFromDisk(normalizedFile);
          try {
            refreshProjectServiceProjects(
              normalizedFile,
              affectedTransformedModuleFiles
            );
          } finally {
            if (shouldCloseTemporaryClientFile) {
              projectService.closeClientFile(normalizedFile);
            }
          }
        }
      } else {
        closeRuntimeState({ preserveReusableProgram: true });
      }
      invalidateTransformedModules(server, affectedTransformedModuleFiles);
    },
    closeBundle() {
      teardown();
    },
    buildEnd() {
      teardown();
    }
  };
}

export { reactDocgenTypescript as default };
