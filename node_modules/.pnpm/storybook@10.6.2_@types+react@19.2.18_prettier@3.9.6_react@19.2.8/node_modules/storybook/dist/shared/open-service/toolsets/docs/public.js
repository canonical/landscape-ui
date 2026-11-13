import {
  resolveToolsetDescription
} from "../../../../_browser-chunks/chunk-WYNCY4CL.js";
import {
  DOCS_TOOLSET_INSTRUCTIONS
} from "../../../../_browser-chunks/chunk-KJ7GNWII.js";
import {
  getToolName,
  toMcpToolName
} from "../../../../_browser-chunks/chunk-TYQWMAQX.js";
import {
  ValiError,
  any,
  array,
  boolean,
  custom,
  description,
  literal,
  looseObject,
  nullable,
  object,
  optional,
  parse,
  parseJson,
  pipe,
  record,
  safeParse,
  string,
  union,
  variant
} from "../../../../_browser-chunks/chunk-VM65THJG.js";
import "../../../../_browser-chunks/chunk-ZF665KZD.js";
import {
  dedent
} from "../../../../_browser-chunks/chunk-3LY4VQVK.js";
import "../../../../_browser-chunks/chunk-IMSF75WX.js";

// src/shared/open-service/toolsets/docs/access.ts
function emptyManifests() {
  return { componentManifest: { v: 1, components: {} } };
}

// src/shared/open-service/toolsets/docs/sources.ts
function getSourceMcpEndpoint(source) {
  let base = new URL(source.url);
  return base.pathname = `${base.pathname.replace(/\/$/, "")}/`, new URL("mcp", base).toString();
}
function formatRequiresOwnMcpNotice(source, endpoint, options = {}) {
  let parts = [];
  return (options.includeHeader ?? !0) && (parts.push(`# ${source.title}`), parts.push(`id: ${source.id}`), parts.push("")), parts.push(
    "This composed Storybook is private and cannot be read through the local Storybook MCP proxy."
  ), parts.push(""), parts.push("Use this source's own MCP endpoint instead:"), parts.push(endpoint), parts.join(`
`);
}
var RequiresOwnMcpError = class extends Error {
  constructor(source) {
    let endpoint = getSourceMcpEndpoint(source);
    super(`Composed Storybook "${source.title}" requires its own MCP endpoint: ${endpoint}`), this.name = "RequiresOwnMcpError", this.source = source, this.endpoint = endpoint;
  }
}, ManifestGetError = class extends Error {
  constructor(message, url, cause) {
    super(message), this.name = "ManifestGetError", this.url = url ?? "No source URL provided", this.cause = cause;
  }
};

// src/shared/open-service/toolsets/docs/manifest-formatter/extract-docs-summary.ts
var MAX_SUMMARY_LENGTH = 90;
function extractDocsSummary(content) {
  let result = content;
  result = result.replace(/^\s*import\s+(?:[\s\S]*?from\s+)?['"][^'"]+['"];?\s*$/gm, "");
  let prevResult = "";
  for (; prevResult !== result; )
    prevResult = result, result = result.replace(/\{[^{}]*\}/g, "");
  for (result = result.replace(/<[^>]+\/>/g, ""), prevResult = ""; prevResult !== result; )
    prevResult = result, result = result.replace(/<(\w+)[^>]*>([\s\S]*?)<\/\1>/g, "$2");
  if (result = result.replace(/<[^>]+>/g, ""), result = result.replace(/\s+/g, " ").trim(), !!result)
    return result.length > 90 ? `${result.slice(0, 90)}...` : result;
}

// src/shared/open-service/toolsets/docs/manifest-formatter/parse-react-docgen.ts
function serializeTsType(tsType) {
  if (tsType) {
    if ("raw" in tsType && typeof tsType.raw == "string" && tsType.raw.trim().length > 0)
      return tsType.raw;
    if (tsType.name) {
      if ("elements" in tsType) {
        let serializeElements = () => (tsType.elements ?? []).map((el) => serializeTsType(el) ?? "unknown");
        switch (tsType.name) {
          case "union":
            return serializeElements().join(" | ");
          case "intersection":
            return serializeElements().join(" & ");
          case "Array":
            return `${serializeTsType((tsType.elements ?? [])[0]) ?? "unknown"}[]`;
          case "tuple":
            return `[${serializeElements().join(", ")}]`;
        }
      }
      if ("value" in tsType && tsType.name === "literal")
        return tsType.value;
      if ("signature" in tsType && tsType.name === "signature") {
        if (tsType.type === "function") {
          let args = (tsType.signature?.arguments ?? []).map((a) => {
            let argType = serializeTsType(a.type) ?? "any";
            return `${a.name}: ${argType}`;
          }), ret = serializeTsType(tsType.signature?.return) ?? "void";
          return `(${args.join(", ")}) => ${ret}`;
        }
        return tsType.type === "object" ? `{ ${(tsType.signature?.properties ?? []).map((p) => {
          let req = !!p.value?.required, propType = serializeTsType(p.value) ?? "any";
          return `${p.key}${req ? "" : "?"}: ${propType}`;
        }).join("; ")} }` : "unknown";
      }
      if ("elements" in tsType) {
        let inner = (tsType.elements ?? []).map((el) => serializeTsType(el) ?? "unknown");
        if (inner.length > 0) return `${tsType.name}<${inner.join(", ")}>`;
      }
      return tsType.name;
    }
  }
}
var parseReactDocgen = (reactDocgen) => {
  let props = reactDocgen?.props ?? {};
  return {
    props: Object.fromEntries(
      Object.entries(props).map(([propName, prop]) => [
        propName,
        {
          description: prop.description,
          type: serializeTsType(prop.tsType ?? prop.type),
          defaultValue: prop.defaultValue?.value,
          required: prop.required
        }
      ])
    )
  };
}, tagValues = (value) => Array.isArray(value) ? value.flatMap(tagValues) : value == null ? [""] : [typeof value == "object" ? JSON.stringify(value) : String(value)], parseComponentDocLike = (componentDoc) => {
  let props = componentDoc.props ?? {}, tags = Object.fromEntries(
    Object.entries(componentDoc.tags ?? {}).map(([tagName, value]) => [tagName, tagValues(value)])
  ), parsedDocgen = {
    props: Object.fromEntries(
      Object.entries(props).map(([propName, prop]) => [
        propName,
        {
          description: prop.description || void 0,
          // RDT uses prop.type.name as a flat string (e.g. "() => void", "{ id: string }")
          // For enums, prefer prop.type.raw which has the full union
          type: prop.type?.raw ?? prop.type?.name,
          defaultValue: prop.defaultValue?.value,
          required: prop.required
        }
      ])
    )
  };
  return Object.keys(tags).length > 0 && (parsedDocgen.tags = tags), parsedDocgen;
}, parseReactDocgenTypescript = (reactDocgenTypescript) => parseComponentDocLike(reactDocgenTypescript), parseReactComponentMeta = (reactComponentMeta) => parseComponentDocLike(reactComponentMeta);

// src/shared/open-service/toolsets/docs/manifest-formatter/markdown.ts
var MAX_STORIES_TO_SHOW = 3, TOP_JSDOC_TAG_NAMES = /* @__PURE__ */ new Set(["deprecated"]), EXAMPLE_JSDOC_TAG_NAME = "example", HIDDEN_JSDOC_TAG_NAMES = /* @__PURE__ */ new Set([
  // Asks for the component to be hidden, so echoing it back is the opposite of the intent.
  "ignore",
  // Consumed by `extractComponentDescription` as the description, which is rendered on its own.
  "desc",
  "description",
  // Storybook's own description override, consumed alongside `desc`.
  "describe",
  // Consumed into the `summary` field, which the component listing already prints.
  "summary",
  // Consumed into the import statement printed above every story snippet.
  "import"
]);
function formatComponentLine(component) {
  let summary = component.summary ?? (component.description ? component.description.length > 90 ? `${component.description.slice(0, 90)}...` : component.description : void 0);
  return summary ? `- ${component.name} (${component.id}): ${summary}` : `- ${component.name} (${component.id})`;
}
function formatDocLine(doc) {
  let title = "title" in doc ? doc.title : void 0, content = "content" in doc ? doc.content : void 0, summary = doc.summary ?? extractDocsSummary(content ?? "");
  return `- ${title ?? doc.name} (${doc.id})${summary ? `: ${summary}` : ""}`;
}
function formatStorySubLine(story) {
  return `  - ${story.name}` + (story.id ? ` (${story.id})` : "");
}
function extractSummary(item, maxLength = 90) {
  if (item.summary)
    return item.summary;
  if (item.description)
    return item.description.length > maxLength ? `${item.description.slice(0, maxLength)}...` : item.description;
}
function getParsedDocgen(componentManifest) {
  if (componentManifest.reactDocgen)
    return parseReactDocgen(componentManifest.reactDocgen);
  if (componentManifest.reactDocgenTypescript)
    return parseReactDocgenTypescript(componentManifest.reactDocgenTypescript);
  if (componentManifest.reactComponentMeta)
    return parseReactComponentMeta(componentManifest.reactComponentMeta);
}
function getNonEmptyJsDocTags(jsDocTags) {
  return jsDocTags && Object.keys(jsDocTags).length > 0 ? jsDocTags : void 0;
}
function getComponentTags(componentManifest, parsedDocgen) {
  return getNonEmptyJsDocTags(componentManifest.jsDocTags) ?? parsedDocgen?.tags;
}
function formatTagName(tagName) {
  return tagName.charAt(0).toUpperCase() + tagName.slice(1);
}
function formatJsDocTagBlockquote(tagName, values) {
  let described = values.filter((value) => value.trim());
  return (described.length > 0 ? described : [""]).flatMap((value) => {
    let [firstLine, ...remainingLines] = value.trim().split(`
`), label = formatTagName(tagName);
    return [
      firstLine ? `> **${label}:** ${firstLine}` : `> **${label}**`,
      ...remainingLines.map((line) => line ? `> ${line}` : ">")
    ];
  });
}
function isTopJsDocTag(tagName) {
  return TOP_JSDOC_TAG_NAMES.has(tagName);
}
function isGenericJsDocTag(tagName) {
  return !TOP_JSDOC_TAG_NAMES.has(tagName) && tagName !== EXAMPLE_JSDOC_TAG_NAME && !HIDDEN_JSDOC_TAG_NAMES.has(tagName);
}
function formatJsDocTags(jsDocTags, includeTag) {
  let parts = [];
  for (let [tagName, values] of Object.entries(jsDocTags ?? {}))
    includeTag(tagName) && parts.push(...formatJsDocTagBlockquote(tagName, values));
  return parts.length > 0 && parts.push(""), parts;
}
function formatExampleJsDocTags(jsDocTags) {
  let examples = jsDocTags?.[EXAMPLE_JSDOC_TAG_NAME];
  return !examples || examples.length === 0 ? [] : examples.flatMap((example) => ["**Example:**", "```", example, "```", ""]);
}
function formatStoryContent(story, importStatement) {
  let parts = [];
  return story.description && (parts.push(story.description), parts.push("")), parts.push("```"), importStatement && (parts.push(importStatement), parts.push("")), parts.push(story.snippet ?? ""), parts.push("```"), parts;
}
function formatPropsSection(parsedDocgen, options = {}) {
  let propEntries = parsedDocgen ? Object.entries(parsedDocgen.props) : [];
  if (propEntries.length === 0)
    return [];
  let title = options.title ?? "## Props", typeName = options.typeName ?? "Props", parts = [];
  parts.push(title), parts.push(""), parts.push("```"), parts.push(`export type ${typeName} = {`);
  for (let [propName, propInfo] of propEntries) {
    let type = propInfo.type ?? "any", isRequired = propInfo.required ?? !0, hasDefault = propInfo.defaultValue !== void 0;
    propInfo.description !== void 0 && (parts.push("  /**"), parts.push(`    ${propInfo.description}`), parts.push("  */"));
    let propLine = `  ${propName}`;
    isRequired || (propLine += "?"), propLine += `: ${type}`, hasDefault && (propLine += ` = ${propInfo.defaultValue}`), propLine += ";", parts.push(propLine);
  }
  return parts.push("}"), parts.push("```"), parts.push(""), parts;
}
var FENCE_LINE = /^\s*(?:```|~~~)/, HEADING_LINE = /^(#{1,4}) /;
function demoteHeadings(markdown) {
  let inFence = !1;
  return markdown.split(`
`).map((line) => FENCE_LINE.test(line) ? (inFence = !inFence, line) : inFence ? line : line.replace(HEADING_LINE, "##$1 ")).join(`
`);
}
function formatSubcomponentsSection(subcomponents) {
  if (!subcomponents || Object.keys(subcomponents).length === 0)
    return [];
  let parts = [];
  parts.push("## Subcomponents"), parts.push("");
  for (let [key, subcomponent] of Object.entries(subcomponents)) {
    let parsedDocgen = getParsedDocgen(subcomponent), jsDocTags = getComponentTags(subcomponent, parsedDocgen);
    if (parts.push(`### ${subcomponent.name || key}`), parts.push(""), parts.push(...formatJsDocTags(jsDocTags, isTopJsDocTag)), subcomponent.summary && (parts.push(subcomponent.summary), parts.push("")), subcomponent.description && (parts.push(subcomponent.description), parts.push("")), parts.push(...formatJsDocTags(jsDocTags, isGenericJsDocTag)), parts.push(...formatExampleJsDocTags(jsDocTags)), subcomponent.import && (parts.push("```"), parts.push(subcomponent.import), parts.push("```"), parts.push("")), subcomponent.error) {
      parts.push(`Error: ${subcomponent.error.name}`), parts.push(""), parts.push("```"), parts.push(subcomponent.error.message), parts.push("```"), parts.push("");
      continue;
    }
    if (subcomponent.apiDescription) {
      parts.push(demoteHeadings(subcomponent.apiDescription)), parts.push("");
      continue;
    }
    let typeName = `${(subcomponent.name || key).replace(/\W+/g, "")}Props`;
    parts.push(...formatPropsSection(parsedDocgen, { title: "#### Props", typeName }));
  }
  return parts;
}
function formatComponentManifest(componentManifest) {
  let parts = [], parsedDocgen = getParsedDocgen(componentManifest), jsDocTags = getComponentTags(componentManifest, parsedDocgen);
  parts.push(`# ${componentManifest.name}`), parts.push(""), parts.push(`ID: ${componentManifest.id}`), parts.push(""), parts.push(...formatJsDocTags(jsDocTags, isTopJsDocTag)), componentManifest.description && (parts.push(componentManifest.description), parts.push("")), parts.push(...formatJsDocTags(jsDocTags, isGenericJsDocTag)), parts.push(...formatExampleJsDocTags(jsDocTags)), parts.push(...formatSubcomponentsSection(componentManifest.subcomponents));
  let { apiDescription } = componentManifest;
  apiDescription && (parts.push(apiDescription), parts.push(""));
  let stories = Array.isArray(componentManifest.stories) ? componentManifest.stories : [];
  if (stories.length > 0) {
    parts.push("## Stories"), parts.push("");
    let storiesWithSnippets = stories.filter((s) => s.snippet), storiesToShow = !!apiDescription || parsedDocgen && Object.keys(parsedDocgen.props).length > 0 ? storiesWithSnippets.slice(0, MAX_STORIES_TO_SHOW) : storiesWithSnippets, shown = new Set(storiesToShow), remainingStories = stories.filter((story) => !shown.has(story));
    for (let story of storiesToShow)
      parts.push(`### ${story.name}`), parts.push(""), story.id && (parts.push(`Story ID: ${story.id}`), parts.push("")), parts.push(...formatStoryContent(story, componentManifest.import)), parts.push("");
    if (remainingStories.length > 0) {
      storiesToShow.length > 0 && (parts.push("### Other Stories"), parts.push(""));
      for (let story of remainingStories) {
        let summary = extractSummary(story), summaryPart = summary ? `: ${summary}` : "", storyLabel = story.id ? `${story.name} (${story.id})` : story.name;
        parts.push(`- ${storyLabel}${summaryPart}`);
      }
      parts.push("");
    }
  }
  if (apiDescription || parts.push(...formatPropsSection(parsedDocgen)), componentManifest.docs && Object.keys(componentManifest.docs).length > 0) {
    let docsWithContent = Object.values(componentManifest.docs).filter(
      (doc) => (doc.content ?? "").trim().length > 0
    );
    if (docsWithContent.length > 0) {
      parts.push("## Docs"), parts.push("");
      for (let doc of docsWithContent)
        parts.push(`### ${doc.name}`), parts.push(""), parts.push(doc.content ?? ""), parts.push("");
    }
  }
  return parts.join(`
`).trim();
}
function formatDocsManifest(doc) {
  return dedent`# ${doc.title ?? doc.name}

			${doc.content ?? ""}`;
}
function formatManifestsToLists(manifests, options = {}) {
  let parts = [];
  parts.push("# Components"), parts.push("");
  for (let component of Object.values(manifests.componentManifest.components))
    if (parts.push(formatComponentLine(component)), options.withStoryIds && Array.isArray(component.stories))
      for (let story of component.stories)
        parts.push(formatStorySubLine(story));
  if (parts.push(""), !manifests.docsManifest)
    return parts.join(`
`).trim();
  parts.push("# Docs"), parts.push("");
  for (let doc of Object.values(manifests.docsManifest.docs))
    parts.push(formatDocLine(doc));
  return parts.join(`
`).trim();
}
function formatMultiSourceManifestsToLists(sources, options = {}) {
  let parts = [];
  for (let { source, manifests, error, notice } of sources) {
    if (parts.push(`# ${source.title}`), parts.push(`id: ${source.id}`), parts.push(""), error) {
      parts.push(`error: ${error}`), parts.push("");
      continue;
    }
    if (notice) {
      parts.push(formatRequiresOwnMcpNotice(source, notice.endpoint, { includeHeader: !1 })), parts.push("");
      continue;
    }
    let components = Object.values(manifests?.componentManifest.components ?? {});
    if (components.length > 0) {
      parts.push("## Components"), parts.push("");
      for (let component of components)
        if (parts.push(formatComponentLine(component)), options.withStoryIds && Array.isArray(component.stories))
          for (let story of component.stories)
            parts.push(formatStorySubLine(story));
      parts.push("");
    }
    let docs = Object.values(manifests?.docsManifest?.docs ?? {});
    if (docs.length > 0) {
      parts.push("## Docs"), parts.push("");
      for (let doc of docs)
        parts.push(formatDocLine(doc));
      parts.push("");
    }
  }
  return parts.join(`
`).trim();
}
function formatStoryDocumentation(componentManifest, storyName) {
  let story = Array.isArray(componentManifest.stories) ? componentManifest.stories.find((s) => s.name === storyName) : void 0;
  if (!story)
    return "";
  let parts = [];
  return parts.push(`# ${componentManifest.name} - ${story.name}`), parts.push(""), story.snippet ? (parts.push(...formatStoryContent(story, componentManifest.import)), parts.join(`
`).trim()) : (story.id && (parts.push(`Story ID: ${story.id}`), parts.push("")), story.description && (parts.push(story.description), parts.push("")), parts.push("No code snippet was extracted for this story."), parts.join(`
`).trim());
}

// src/shared/open-service/toolsets/docs/manifest-formatter/adapt-core-manifest.ts
var ARG_TYPES_KEY = "argTypes";
function adaptCoreStories(stories) {
  if (stories)
    return Array.isArray(stories) ? stories : Object.values(stories);
}
function adaptCoreDoc(doc) {
  return { ...doc };
}
function adaptCoreComponent(core) {
  let { stories, docs, [ARG_TYPES_KEY]: _argTypes, ...rest } = core, component = { ...rest }, adaptedStories = adaptCoreStories(stories);
  return adaptedStories && (component.stories = adaptedStories), docs && (component.docs = Object.fromEntries(
    Object.entries(docs).map(([id, doc]) => [id, adaptCoreDoc(doc)])
  )), component;
}

// src/shared/open-service/toolsets/docs/manifest-formatter/manifest-types.ts
var JSDocTag = record(string(), array(string())), ManifestErrorSchema = object({
  name: string(),
  message: string()
}), BaseManifest = object({
  name: string(),
  description: optional(string()),
  jsDocTags: optional(JSDocTag),
  error: optional(ManifestErrorSchema)
}), StorySchema = object({
  ...BaseManifest.entries,
  id: optional(string()),
  snippet: optional(string()),
  summary: optional(string())
}), JsonRef = object({
  $ref: string()
}), DocV0 = object({
  id: string(),
  name: string(),
  title: optional(string()),
  path: optional(string()),
  content: optional(string()),
  summary: optional(string()),
  error: optional(ManifestErrorSchema)
}), BaseInlineComponentProperties = object({
  ...BaseManifest.entries,
  path: optional(string()),
  summary: optional(string()),
  import: optional(string()),
  // Framework-authored Markdown, rendered in place of the props section derived from `react*`.
  apiDescription: optional(string()),
  renderer: optional(string()),
  // Mirrors the docgen-engine payloads, which the parsers narrow structurally at runtime.
  reactDocgen: optional(any()),
  reactDocgenTypescript: optional(any()),
  reactComponentMeta: optional(any())
}), SubcomponentManifest = object({
  ...BaseInlineComponentProperties.entries
}), ComponentManifestV0 = object({
  ...BaseInlineComponentProperties.entries,
  id: string(),
  stories: optional(array(StorySchema)),
  subcomponents: optional(record(string(), SubcomponentManifest)),
  docs: optional(record(string(), DocV0))
}), ComponentManifestMapV0 = object({
  v: literal(0),
  components: record(string(), ComponentManifestV0)
}), DocsManifestMapV0 = object({
  v: literal(0),
  docs: record(string(), DocV0)
}), DocV1 = object({
  id: string(),
  name: string(),
  summary: optional(string()),
  mdx: optional(JsonRef),
  error: optional(ManifestErrorSchema)
}), ComponentManifestV1 = object({
  id: string(),
  name: string(),
  description: optional(string()),
  summary: optional(string()),
  error: optional(ManifestErrorSchema),
  docgen: optional(JsonRef),
  stories: optional(union([JsonRef, array(StorySchema)])),
  docs: optional(record(string(), DocV1))
}), ComponentManifestMapV1 = object({
  v: literal(1),
  components: record(string(), ComponentManifestV1)
}), DocsManifestMapV1 = object({
  v: literal(1),
  docs: record(string(), DocV1)
}), ComponentManifestMap = variant("v", [
  ComponentManifestMapV0,
  ComponentManifestMapV1
]), DocsManifestMap = variant("v", [DocsManifestMapV0, DocsManifestMapV1]);

// src/shared/open-service/toolsets/docs/map-with-concurrency.ts
async function mapWithConcurrency(items, limit, fn) {
  if (items.length === 0)
    return [];
  let safeLimit = Number.isFinite(limit) ? limit : items.length, concurrency = Math.max(1, Math.min(safeLimit, items.length)), results = Array(items.length), nextIndex = 0;
  async function worker() {
    for (; nextIndex < items.length; ) {
      let index = nextIndex++;
      results[index] = await fn(items[index], index);
    }
  }
  return await Promise.all(Array.from({ length: concurrency }, () => worker())), results;
}

// src/shared/open-service/toolsets/docs/access-provider.ts
var STORY_REF_CONCURRENCY = 16, COMPONENT_MANIFEST_PATH = "./manifests/components.json", DOCS_MANIFEST_PATH = "./manifests/docs.json";
function getManifestUrlFromRequest(request, path) {
  return new URL(`/${path.replace(/^\.\//, "")}`, request.url).toString();
}
async function defaultManifestProvider(request, path) {
  if (!request)
    throw new ManifestGetError(
      "Request is required when using the default manifest provider. You must either pass the original request forward to the server context, or set a custom manifestProvider that doesn't need the request."
    );
  let manifestUrl = getManifestUrlFromRequest(request, path), response = await fetch(manifestUrl);
  if (!response.ok)
    throw new ManifestGetError(
      `Failed to fetch manifest: ${response.status} ${response.statusText}`,
      manifestUrl
    );
  let contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json"))
    throw new ManifestGetError(
      `Invalid content type: expected application/json, got ${contentType}`,
      manifestUrl
    );
  return response.text();
}
function parseManifest({
  jsonString,
  schema,
  name,
  url
}) {
  try {
    return parse(pipe(string(), parseJson(), schema), jsonString);
  } catch (error) {
    throw new ManifestGetError(
      `Failed to parse ${name} manifest:
${error instanceof ValiError ? error.issues.map((i) => i.message).join(`
`) : String(error)}`,
      url
    );
  }
}
async function fetchManifests(request, manifestProvider, source) {
  let provider = manifestProvider ?? defaultManifestProvider, [componentResult, docsResult] = await Promise.allSettled([
    provider(request, COMPONENT_MANIFEST_PATH, source),
    provider(request, DOCS_MANIFEST_PATH, source)
  ]), getUrl = (path) => request ? getManifestUrlFromRequest(request, path) : "Unknown manifest source";
  if (componentResult.status === "rejected") {
    let reason = componentResult.reason;
    if (reason instanceof RequiresOwnMcpError)
      throw reason;
    let hint = reason instanceof ManifestGetError && reason.message.includes("404") ? "\nHint: The Storybook at this URL may not have the component manifest enabled. Add `features: { componentsManifest: true }` (or `features: { experimentalComponentsManifest: true }` for older Storybook versions) to its main.ts config." : "";
    throw new ManifestGetError(
      `Failed to get component manifest: ${reason instanceof Error ? reason.message : String(reason)}${hint}`,
      getUrl(COMPONENT_MANIFEST_PATH),
      reason instanceof Error ? reason : void 0
    );
  }
  let componentManifest = parseManifest({
    jsonString: componentResult.value,
    schema: ComponentManifestMap,
    name: "component",
    url: getUrl(COMPONENT_MANIFEST_PATH)
  });
  if (Object.keys(componentManifest.components).length === 0)
    throw new ManifestGetError(
      "No components found in the manifest",
      getUrl(COMPONENT_MANIFEST_PATH)
    );
  if (docsResult.status === "rejected")
    return { componentManifest };
  let docsManifest = parseManifest({
    jsonString: docsResult.value,
    schema: DocsManifestMap,
    name: "docs",
    url: getUrl(DOCS_MANIFEST_PATH)
  });
  return { componentManifest, docsManifest };
}
function parseManifestRef(ref) {
  let [filePath = "", hash = ""] = ref.split("#"), manifestDir = COMPONENT_MANIFEST_PATH.replace(/^\.\//, "").replace(/[^/]+$/, ""), resolved = new URL(filePath, `https://localhost/${manifestDir}`).pathname.replace(
    /^\//,
    ""
  ), pointer = hash.split("/").filter(Boolean).map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"));
  return { path: `./${resolved}`, pointer };
}
var jsonObject = (schema) => pipe(
  // Checked on the raw input: `looseObject` copies an array's entries into a plain object, so by
  // the time it has run there is nothing left to recognise.
  custom((input) => !Array.isArray(input), "Expected a JSON object"),
  schema
), DocgenRefPayload = jsonObject(looseObject({})), StoryDocsRefPayload = nullable(
  jsonObject(
    looseObject({
      // A record keyed by story id, or an already-resolved array — `adaptCoreStories` accepts both.
      stories: optional(
        union([record(string(), looseObject({})), array(looseObject({}))])
      ),
      import: optional(string())
    })
  )
), MdxRefPayload = jsonObject(
  looseObject({ id: optional(string()), name: optional(string()) })
);
async function fetchRefValue(ref, request, provider, source, schema) {
  let { path, pointer } = parseManifestRef(ref), jsonString = await provider(request, path, source), target;
  try {
    target = JSON.parse(jsonString);
  } catch (error) {
    throw new ManifestGetError(
      `Failed to parse externalized payload referenced by "${ref}"`,
      path,
      error instanceof Error ? error : void 0
    );
  }
  for (let key of pointer)
    if (target && typeof target == "object" && Object.hasOwn(target, key))
      target = target[key];
    else
      throw new ManifestGetError(
        `Reference "${ref}" could not be resolved: missing "${key}".`,
        path
      );
  let parsed = safeParse(schema, target);
  if (!parsed.success)
    throw new ManifestGetError(
      `Payload referenced by "${ref}" is not a valid manifest payload.`,
      path
    );
  return parsed.output;
}
async function resolveComponentEntry(component, request, manifestProvider, source) {
  let docgenRef = "docgen" in component ? component.docgen?.$ref : void 0, storiesRef = component.stories && !Array.isArray(component.stories) ? component.stories.$ref : void 0, docEntries = component.docs ? Object.entries(component.docs) : [], docRefs = docEntries.filter(([, doc]) => "mdx" in doc && !!doc.mdx?.$ref);
  if (!docgenRef && !storiesRef && docRefs.length === 0)
    return component;
  let provider = manifestProvider ?? defaultManifestProvider, identity = {
    id: component.id,
    name: component.name,
    ...component.description !== void 0 ? { description: component.description } : {},
    ...component.summary !== void 0 ? { summary: component.summary } : {},
    ...component.error !== void 0 ? { error: component.error } : {}
  }, core = identity;
  if (docgenRef) {
    let payload = await fetchRefValue(
      docgenRef,
      request,
      provider,
      source,
      DocgenRefPayload
    );
    core = { ...core, ...payload, ...identity };
  }
  if (Array.isArray(component.stories) && (core.stories = component.stories), storiesRef) {
    let storyDocs = await fetchRefValue(storiesRef, request, provider, source, StoryDocsRefPayload);
    storyDocs?.stories && (core.stories = storyDocs.stories), storyDocs?.import && (core.import = storyDocs.import);
  }
  if (docEntries.length > 0) {
    let docs = {};
    for (let [docId, doc] of docEntries) {
      let mdxRef = "mdx" in doc ? doc.mdx?.$ref : void 0;
      docs[docId] = mdxRef ? await fetchRefValue(mdxRef, request, provider, source, MdxRefPayload) : doc;
    }
    core.docs = docs;
  }
  return adaptCoreComponent(core);
}
async function resolveComponentStories(component, request, manifestProvider, source) {
  if (!component.stories || Array.isArray(component.stories))
    return component;
  let provider = manifestProvider ?? defaultManifestProvider, storyDocs = await fetchRefValue(
    component.stories.$ref,
    request,
    provider,
    source,
    StoryDocsRefPayload
  );
  return {
    ...component,
    stories: storyDocs?.stories ? adaptCoreStories(storyDocs.stories) ?? [] : []
  };
}
async function resolveDocEntry(doc, request, manifestProvider, source) {
  let ref = "mdx" in doc ? doc.mdx?.$ref : void 0;
  if (!ref)
    return doc;
  let payload = await fetchRefValue(ref, request, manifestProvider ?? defaultManifestProvider, source, MdxRefPayload);
  return adaptCoreDoc({
    ...payload,
    id: payload.id ?? doc.id,
    name: payload.name ?? doc.name
  });
}
function createProviderDocsAccess({
  manifestProvider,
  getRequest,
  source,
  resolveEntry
} = {}) {
  let request = () => getRequest?.();
  return {
    async list({ withStoryIds }) {
      let manifests = await fetchManifests(request(), manifestProvider, source);
      if (withStoryIds) {
        let components = manifests.componentManifest.components;
        try {
          let resolved = await mapWithConcurrency(
            Object.entries(components),
            STORY_REF_CONCURRENCY,
            async ([id, component]) => [
              id,
              await resolveComponentStories(component, request(), manifestProvider, source)
            ]
          );
          for (let [id, component] of resolved)
            components[id] = component;
        } catch (error) {
          if (!source)
            throw error;
        }
      }
      return { ...emptyManifests(), ...manifests };
    },
    async resolve(id) {
      if (resolveEntry && !source?.url)
        return resolveEntry(id, source);
      let { componentManifest, docsManifest } = await fetchManifests(
        request(),
        manifestProvider,
        source
      ), components = componentManifest.components, componentEntry = Object.hasOwn(components, id) ? components[id] : void 0;
      if (componentEntry)
        return {
          kind: "component",
          component: await resolveComponentEntry(
            componentEntry,
            request(),
            manifestProvider,
            source
          )
        };
      let docs = docsManifest?.docs, docEntry = docs && Object.hasOwn(docs, id) ? docs[id] : void 0;
      if (docEntry)
        return {
          kind: "doc",
          doc: await resolveDocEntry(docEntry, request(), manifestProvider, source)
        };
    }
  };
}

// src/shared/open-service/toolsets/docs/multi-source.ts
function createCompositionDocsSources({
  sources,
  manifestProvider,
  getRequest,
  localAccess,
  resolveEntry
}) {
  return sources.map((source) => ({
    source,
    access: localAccess && !source.url ? localAccess : createProviderDocsAccess({ source, manifestProvider, getRequest, resolveEntry })
  }));
}
async function listSources(sources, options) {
  let listings = await Promise.all(
    sources.map(async ({ source, access }) => {
      try {
        return { source, manifests: await access.list(options) };
      } catch (error) {
        return error instanceof RequiresOwnMcpError ? { source, notice: { kind: "requires-own-mcp", endpoint: error.endpoint } } : { source, error: error instanceof Error ? error.message : String(error) };
      }
    })
  );
  if (listings.filter((listing) => !listing.error).length === 0)
    throw new ManifestGetError(
      `Failed to fetch manifests from any source. Errors:
${listings.map((listing) => `- ${listing.source.title}: ${listing.error}`).join(`
`)}`
    );
  return listings;
}

// src/shared/open-service/toolsets/estimate-tokens.ts
function isWhitespace(code) {
  return code === 32 || code === 9 || code === 10 || code === 13;
}
function isAlphanumeric(code) {
  return code >= 48 && code <= 57 || code >= 65 && code <= 90 || code >= 97 && code <= 122 || code === 95;
}
function estimateTokens(text) {
  if (!text) return 0;
  let tokenCount = 0, i = 0, len = text.length;
  for (; i < len; ) {
    let code = text.charCodeAt(i);
    if (isWhitespace(code))
      for (tokenCount++, i++; i < len && isWhitespace(text.charCodeAt(i)); )
        i++;
    else if (isAlphanumeric(code))
      for (tokenCount++, i++; i < len && isAlphanumeric(text.charCodeAt(i)); )
        i++;
    else
      tokenCount++, i++;
  }
  return tokenCount;
}

// src/shared/open-service/toolsets/docs/definition.ts
var DOCS_TOOLSET_ID = "docs", DOCS_METHOD_NAMES = {
  list: "list",
  show: "show",
  showStory: "showStory"
}, DOCS_METHOD_REFS = {
  list: `${DOCS_TOOLSET_ID}.${DOCS_METHOD_NAMES.list}`,
  show: `${DOCS_TOOLSET_ID}.${DOCS_METHOD_NAMES.show}`,
  showStory: `${DOCS_TOOLSET_ID}.${DOCS_METHOD_NAMES.showStory}`
};
function selectReportedManifests({
  manifests,
  sources
}) {
  return manifests ?? sources?.find((listing) => listing.manifests)?.manifests;
}
function resolveShow({ entry, sourceError }) {
  return sourceError !== void 0 ? { kind: "source-error", message: sourceError } : entry === void 0 ? { kind: "entry-missing" } : { kind: "found", entry };
}
function isShowStorySelector({ storyId, componentId, storyName }) {
  return storyId !== void 0 || componentId !== void 0 && storyName !== void 0;
}
function componentIdOfStoryId(storyId) {
  let separator = storyId.indexOf("--");
  return separator === -1 ? storyId : storyId.slice(0, separator);
}
function resolveShowStory(data) {
  let { entry, storyId, storyName, sourceError } = data;
  if (!isShowStorySelector(data))
    return { kind: "input-invalid" };
  if (sourceError !== void 0)
    return { kind: "source-error", message: sourceError };
  if (entry === void 0 || entry.kind !== "component")
    return { kind: "component-missing" };
  let { component } = entry, story = storyId !== void 0 ? component.stories?.find((candidate) => candidate.id === storyId) : component.stories?.find((candidate) => candidate.name === storyName);
  return story ? { kind: "found", component, story } : { kind: "story-missing", component };
}
function isDocsShowError(output) {
  return resolveShow(output).kind !== "found";
}
function isDocsShowStoryError(output) {
  return resolveShowStory(output).kind !== "found";
}
function describeList(ctx) {
  return `List all available UI components and documentation entries from the Storybook, returning the IDs the other documentation tools take as input. Call this first for any UI task \u2014 before writing a new component, check what the design system already provides and build on it instead of hand-rolling a duplicate; before answering any question about props, API, or usage, discover the relevant IDs here rather than reading component source. Then fetch the entries with ${getToolName(ctx)(DOCS_METHOD_REFS.show)}, referencing only IDs returned here \u2014 never guess IDs. When multiple Storybook sources are configured, entries from every source are included; scope follow-up calls to one source via their \`storybookId\` input. Pass \`withStoryIds: true\` when you need story IDs for other tools.`;
}
function describeShow(ctx) {
  return `Get documentation for a UI component or docs entry.

Returns the first ${MAX_STORIES_TO_SHOW} stories (including story IDs) with code snippets showing how props are used, plus TypeScript prop definitions. Call this before using a component to avoid hallucinating prop names, types, or valid combinations, and to answer any question about a component's props, API, or usage \u2014 reading or grepping the component source is not a substitute. Stories reveal real prop usage patterns, interactions, and edge cases that type definitions alone don't show. If the example stories don't show the prop you need, use the ${getToolName(ctx)(DOCS_METHOD_REFS.showStory)} tool to fetch the story documentation for the specific story variant you need \u2014 its story ID can be passed directly as \`storyId\`.

Example: id="button" returns Primary, Secondary, Large stories with code like <Button variant="primary" size="large"> showing actual prop combinations.`;
}
function formatEntryNotFound(id, storybookId, ctx) {
  let suffix = storybookId ? ` in source "${storybookId}"` : "";
  return `Component or Docs Entry not found: "${id}"${suffix}. Use the ${getToolName(ctx)(DOCS_METHOD_REFS.list)} tool to see available components and documentation entries.`;
}
function renderShow(data, ctx) {
  let resolution = resolveShow(data);
  switch (resolution.kind) {
    case "source-error":
      return resolution.message;
    case "entry-missing":
      return formatEntryNotFound(data.id, data.storybookId, ctx);
    case "found":
      return resolution.entry.kind === "doc" ? formatDocsManifest(resolution.entry.doc) : formatComponentManifest(resolution.entry.component);
    default:
      return resolution;
  }
}
function formatAvailableStories(stories) {
  return stories?.map((story) => story.id ? `${story.name} (${story.id})` : story.name).join(", ") || "none";
}
function renderShowStory(resolution, data, ctx) {
  switch (resolution.kind) {
    case "input-invalid":
      return `Provide either \`storyId\`, or both \`componentId\` and \`storyName\`. Story ids are listed by the ${getToolName(ctx)(DOCS_METHOD_REFS.list)} tool with \`withStoryIds: true\` and in ${getToolName(ctx)(DOCS_METHOD_REFS.show)} output.`;
    case "source-error":
      return resolution.message;
    case "component-missing":
      return data.storyId !== void 0 ? `Story not found: "${data.storyId}". Use the ${getToolName(ctx)(DOCS_METHOD_REFS.list)} tool with \`withStoryIds: true\` to see available stories and their ids.` : `Component not found: "${data.componentId}". Use the ${getToolName(ctx)(DOCS_METHOD_REFS.list)} tool to see available components.`;
    case "story-missing": {
      let availableStories = formatAvailableStories(resolution.component.stories);
      return data.storyId !== void 0 ? `Story not found: "${data.storyId}" for component "${resolution.component.id}". Available stories: ${availableStories}` : `Story "${data.storyName}" not found for component "${data.componentId}". Available stories: ${availableStories}`;
    }
    case "found":
      return formatStoryDocumentation(resolution.component, resolution.story.name);
    default:
      return resolution;
  }
}
var storybookIdField = {
  storybookId: pipe(
    string(),
    description('The ID of the Storybook source to query (e.g., "local", "design-system")')
  )
};
function selectSource(sources, storybookId, ctx) {
  if (!sources?.length)
    return {};
  let available = sources.map(({ source }) => source.id).join(", "), listRef = `Use the ${getToolName(ctx)(DOCS_METHOD_REFS.list)} tool to see available sources.`;
  if (!storybookId)
    return { sourceError: `storybookId is required. Available sources: ${available}. ${listRef}` };
  let match = sources.find(({ source }) => source.id === storybookId);
  return match ? { access: match.access } : {
    sourceError: `Storybook source not found: "${storybookId}". Available sources: ${available}. ${listRef}`
  };
}
function createDocsToolset(options) {
  let { docsAccess, sources } = options, multiSource = !!sources?.length;
  if (!multiSource && !docsAccess)
    throw new Error("createDocsToolset requires a docsAccess or at least one source.");
  let showSchema = multiSource ? object({
    id: pipe(string(), description('The component or docs entry ID (e.g., "button")')),
    ...storybookIdField
  }) : object({
    id: pipe(string(), description('The component or docs entry ID (e.g., "button")'))
  }), showStoryFields = {
    storyId: pipe(
      optional(string()),
      description(
        'The story ID, as listed by the docs list tool with withStoryIds: true and shown next to each story in the component documentation (e.g., "button--primary"). Prefer this over componentId + storyName whenever you have a story ID.'
      )
    ),
    componentId: pipe(
      optional(string()),
      description(
        'The component ID (e.g., "button"). Use together with storyName, and only when you have no story ID.'
      )
    ),
    storyName: pipe(
      optional(string()),
      description(
        'The human-readable story name (e.g., "Primary"). Use together with componentId.'
      )
    )
  }, showStorySchema = multiSource ? object({ ...showStoryFields, ...storybookIdField }) : object(showStoryFields), access = (storybookId, ctx) => multiSource ? selectSource(sources, storybookId, ctx) : { access: docsAccess };
  return {
    id: DOCS_TOOLSET_ID,
    description: "Storybook component and docs documentation.",
    methods: {
      [DOCS_METHOD_NAMES.list]: {
        input: object({
          withStoryIds: optional(
            pipe(
              boolean(),
              description(
                "When true, includes story sub-bullets under each component with story name and story ID. Use this to discover IDs for downstream story-focused workflows without filesystem lookup."
              )
            ),
            !1
          )
        }),
        title: "List All Documentation",
        description: describeList,
        handler: async (input) => {
          let { withStoryIds } = input, data = multiSource ? { withStoryIds, sources: await listSources(sources, { withStoryIds }) } : { withStoryIds, manifests: await docsAccess.list({ withStoryIds }) }, markdown = data.sources ? formatMultiSourceManifestsToLists(data.sources, { withStoryIds }) : formatManifestsToLists(data.manifests, { withStoryIds }), counted = selectReportedManifests(data);
          return {
            ok: !0,
            data,
            markdown,
            ...counted ? {
              telemetry: {
                payload: {
                  componentCount: Object.keys(counted.componentManifest.components).length,
                  docsCount: Object.keys(counted.docsManifest?.docs ?? {}).length,
                  resultTokenCount: estimateTokens(markdown),
                  sourceCount: data.sources?.length
                }
              }
            } : {}
          };
        }
      },
      [DOCS_METHOD_NAMES.show]: {
        input: showSchema,
        title: "Get Documentation",
        description: describeShow,
        handler: async (input, ctx) => {
          let { id, storybookId } = input, selected = access(storybookId, ctx), data = selected.sourceError ? { id, storybookId, sourceError: selected.sourceError } : { id, storybookId, entry: await selected.access.resolve(id) }, markdown = renderShow(data, ctx), telemetry = {
            payload: {
              componentId: id,
              found: data.entry !== void 0,
              resultTokenCount: estimateTokens(markdown)
            }
          };
          return isDocsShowError(data) ? { ok: !1, data, markdown, telemetry } : { ok: !0, data, markdown, telemetry };
        }
      },
      [DOCS_METHOD_NAMES.showStory]: {
        input: showStorySchema,
        title: "Get Documentation for Story",
        description: "Get detailed documentation for a specific story variant of a UI component. Use this when you need to see more usage examples of a component, via the stories written for it. Identify the story by its story ID (preferred), or by componentId plus storyName.",
        handler: async (input, ctx) => {
          let { storyId, componentId, storyName, storybookId } = input, request = { storyId, componentId, storyName, storybookId }, resolveId = storyId !== void 0 ? componentIdOfStoryId(storyId) : componentId !== void 0 && storyName !== void 0 ? componentId : void 0, selected = resolveId !== void 0 ? access(storybookId, ctx) : {}, data = selected.access && resolveId !== void 0 ? { ...request, entry: await selected.access.resolve(resolveId) } : { ...request, sourceError: selected.sourceError }, resolution = resolveShowStory(data), markdown = renderShowStory(resolution, data, ctx), telemetry = {
            payload: {
              found: resolution.kind === "found",
              storyId: resolution.kind === "found" ? resolution.story.id : storyId,
              lookup: storyId !== void 0 ? "storyId" : "name",
              resultTokenCount: estimateTokens(markdown)
            }
          };
          return resolution.kind === "found" ? { ok: !0, data, markdown, telemetry } : { ok: !1, data, markdown, telemetry };
        }
      }
    }
  };
}
export {
  COMPONENT_MANIFEST_PATH,
  ComponentManifestMap,
  ComponentManifestMapV0,
  ComponentManifestMapV1,
  DOCS_MANIFEST_PATH,
  DOCS_TOOLSET_INSTRUCTIONS,
  DocsManifestMap,
  DocsManifestMapV0,
  DocsManifestMapV1,
  JsonRef,
  MAX_STORIES_TO_SHOW,
  MAX_SUMMARY_LENGTH,
  ManifestGetError,
  RequiresOwnMcpError,
  adaptCoreComponent,
  adaptCoreDoc,
  adaptCoreStories,
  createCompositionDocsSources,
  createDocsToolset,
  createProviderDocsAccess,
  emptyManifests,
  estimateTokens,
  extractDocsSummary,
  fetchManifests,
  formatComponentManifest,
  formatDocsManifest,
  formatManifestsToLists,
  formatRequiresOwnMcpNotice,
  formatStoryDocumentation,
  getSourceMcpEndpoint,
  getToolName,
  isDocsShowError,
  isDocsShowStoryError,
  listSources,
  parseManifestRef,
  parseReactComponentMeta,
  parseReactDocgen,
  parseReactDocgenTypescript,
  resolveComponentEntry,
  resolveComponentStories,
  resolveDocEntry,
  resolveToolsetDescription,
  selectReportedManifests,
  toMcpToolName
};
