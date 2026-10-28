import * as v from "valibot";

//#region node_modules/@standard-schema/spec/dist/index.d.ts
/** The Standard Typed interface. This is a base type extended by other specs. */
interface StandardTypedV1<Input = unknown, Output = Input> {
  /** The Standard properties. */
  readonly "~standard": StandardTypedV1.Props<Input, Output>;
}
declare namespace StandardTypedV1 {
  /** The Standard Typed properties interface. */
  interface Props<Input = unknown, Output = Input> {
    /** The version number of the standard. */
    readonly version: 1;
    /** The vendor name of the schema library. */
    readonly vendor: string;
    /** Inferred types associated with the schema. */
    readonly types?: Types<Input, Output> | undefined;
  }
  /** The Standard Typed types interface. */
  interface Types<Input = unknown, Output = Input> {
    /** The input type of the schema. */
    readonly input: Input;
    /** The output type of the schema. */
    readonly output: Output;
  }
  /** Infers the input type of a Standard Typed. */
  type InferInput<Schema extends StandardTypedV1> = NonNullable<Schema["~standard"]["types"]>["input"];
  /** Infers the output type of a Standard Typed. */
  type InferOutput<Schema extends StandardTypedV1> = NonNullable<Schema["~standard"]["types"]>["output"];
}
/** The Standard Schema interface. */
interface StandardSchemaV1<Input = unknown, Output = Input> {
  /** The Standard Schema properties. */
  readonly "~standard": StandardSchemaV1.Props<Input, Output>;
}
declare namespace StandardSchemaV1 {
  /** The Standard Schema properties interface. */
  interface Props<Input = unknown, Output = Input> extends StandardTypedV1.Props<Input, Output> {
    /** Validates unknown input values. */
    readonly validate: (value: unknown, options?: StandardSchemaV1.Options | undefined) => Result<Output> | Promise<Result<Output>>;
  }
  /** The result interface of the validate function. */
  type Result<Output> = SuccessResult<Output> | FailureResult;
  /** The result interface if validation succeeds. */
  interface SuccessResult<Output> {
    /** The typed output value. */
    readonly value: Output;
    /** A falsy value for `issues` indicates success. */
    readonly issues?: undefined;
  }
  interface Options {
    /** Explicit support for additional vendor-specific parameters, if needed. */
    readonly libraryOptions?: Record<string, unknown> | undefined;
  }
  /** The result interface if validation fails. */
  interface FailureResult {
    /** The issues of failed validation. */
    readonly issues: ReadonlyArray<Issue>;
  }
  /** The issue interface of the failure output. */
  interface Issue {
    /** The error message of the issue. */
    readonly message: string;
    /** The path of the issue, if any. */
    readonly path?: ReadonlyArray<PropertyKey | PathSegment> | undefined;
  }
  /** The path segment interface of the issue. */
  interface PathSegment {
    /** The key representing a path segment. */
    readonly key: PropertyKey;
  }
  /** The Standard types interface. */
  interface Types<Input = unknown, Output = Input> extends StandardTypedV1.Types<Input, Output> {}
  /** Infers the input type of a Standard. */
  type InferInput<Schema extends StandardTypedV1> = StandardTypedV1.InferInput<Schema>;
  /** Infers the output type of a Standard. */
  type InferOutput<Schema extends StandardTypedV1> = StandardTypedV1.InferOutput<Schema>;
}
/** The Standard JSON Schema interface. */
//#endregion
//#region code/core/.dts-emit/code/core/src/shared/open-service/types.d.ts
type GetServiceOptions = {
  /**
   * Required when the target service is marked `internal: true`. Internal OSA surfaces are unstable
   * and may change without a semver bump — only pass this when you intentionally accept that risk.
   */
  internal?: boolean;
};
//#endregion
//#region code/core/.dts-emit/code/core/src/shared/open-service/toolset-definition.d.ts
type AnySchema = StandardSchemaV1<unknown, unknown>;
type ToolsetTransport = 'cli' | 'mcp' | 'sdk';
/**
 * Service lookup for toolset handlers. Intentionally not keyed to ServerCoreServices:
 * toolsets may call core OSA (with `{ internal: true }`) or optional addon services by id.
 */
type ToolsetGetService = {
  <TInstance = unknown>(serviceId: string, options?: GetServiceOptions): TInstance;
};
type ToolsetCtx = {
  transport: ToolsetTransport;
  /**
   * Storybook UI base URL, including any deployment subpath. Absent when running from a CLI
   * without a live Storybook.
   */
  origin?: string;
  getService: ToolsetGetService;
};
/**
 * A handler's usage report: the payload describing what the call did, counts and flags alike. It
 * travels on the outcome, so a handler reports at most once and in the same object as its data.
 * The surface that ran the method turns it into its own telemetry record and names the event; a
 * handler never names one.
 */
type ToolsetTelemetryReport = {
  payload: Record<string, unknown>;
};
/**
 * A method description, resolved per transport.
 *
 * The function form exists because descriptions cross-reference sibling methods, and each surface
 * spells those differently (`stories-changed` on MCP, `npx storybook tools stories changed` on
 * the CLI, dotted `toolsetId.methodName` in the SDK). Use `getToolName(ctx)` to render a reference
 * rather than hardcoding a spelling.
 */
type ToolsetMethodDescription = string | ((context: ToolsetCtx) => string);
/**
 * The result of one method run: the tag, the structured data, the rendered Markdown, and the usage
 * report, all from a single execution.
 *
 * The failure model in one line each: could not do the job → throw; did the job and the answer is
 * bad news → return `{ ok: false, data, markdown }`. Adapters unwrap mechanically — text blocks
 * from `markdown`, `structuredContent` from `data`, MCP `isError` (and later CLI exit codes) from
 * `ok` — so everything a method means lives on its definition, never re-derived outside it.
 *
 * Declare `TFailure = never` for infallible methods; the signature then documents fallibility and
 * TypeScript narrows both branches. Return plain object literals: contextual typing against this
 * union does the narrowing, no factory helpers needed.
 *
 * `markdown` may be multiple strings: MCP renders each as its own text block (`stories-preview`
 * renders one block per URL), the CLI joins them with newlines.
 */
type ToolsetOutcome<TSuccess, TFailure = TSuccess, TReport extends ToolsetTelemetryReport = ToolsetTelemetryReport> = {
  readonly ok: true;
  readonly data: TSuccess;
  readonly markdown: string | string[];
  readonly telemetry?: TReport;
} | {
  readonly ok: false;
  readonly data: TFailure;
  readonly markdown: string | string[];
  readonly telemetry?: TReport;
};
type AnyToolsetOutcome = ToolsetOutcome<any, any>;
/** Output schema for a published toolset method. Must describe a JSON object. */
type ToolsetObjectOutputSchema = StandardSchemaV1<Record<string, unknown>, Record<string, unknown>>;
/**
 * One public method: description, input schema, optional output schema, and one handler.
 *
 * The handler produces the whole {@link ToolsetOutcome} — data, side effects, the usage report,
 * and the rendered Markdown — because one MCP response carries `content` (text) and
 * `structuredContent` (JSON) at once, and both must come from a single run: re-running a method
 * with side effects would repeat them. The usage report is part of the returned object, with the
 * rendered text in hand, so no consumer can forget it.
 */
type ToolsetMethod<TSchema extends AnySchema = AnySchema, TOutcome extends AnyToolsetOutcome = AnyToolsetOutcome> = {
  /**
   * Short display label shown by client UIs (e.g. an MCP client's tool list). Editable prose like
   * `description`, not an invokable tool name.
   */
  title: string;
  description: ToolsetMethodDescription;
  input: TSchema; /** Published as the MCP tool's `outputSchema`. Must describe a JSON object. */
  output?: ToolsetObjectOutputSchema;
  /**
   * Marks a method that can only do its job against a running Storybook dev server — because it
   * needs a live origin for its URLs or reads state only the dev server owns. Consumers that run
   * without one (the `storybook tools` CLI) surface these methods behind one uniform contract:
   * start the dev server first. Adapters that always have a dev server (MCP) ignore the trait.
   */
  requiresDevServer?: true;
  handler: (input: StandardSchemaV1.InferOutput<TSchema>, context: ToolsetCtx) => TOutcome | Promise<TOutcome>;
};
type AnyToolsetMethod = ToolsetMethod<any, AnyToolsetOutcome>;
type ToolsetMethods = Record<string, AnyToolsetMethod>;
type ToolsetDefinition<TId extends string = string, TMethods extends ToolsetMethods = ToolsetMethods> = {
  id: TId;
  description: string;
  methods: TMethods;
};
/** Resolves a method description for one transport. */
declare function resolveToolsetDescription(description: ToolsetMethodDescription, context: ToolsetCtx): string;
//#endregion
//#region code/core/.dts-emit/code/core/src/shared/open-service/toolset-names.d.ts
type ToolsetMethodId = `${string}.${string}`;
/** `stories.findByComponent` -> `stories-find-by-component`. */
declare function toMcpToolName(method: ToolsetMethodId): string;
/**
 * Renders how a toolset method is spelled for the active transport.
 *
 * Not a composed-Storybook "ref" (`refs` in `main.js`) — the name is the invokable tool/command
 * string agents see. Descriptions that tell an agent to call another tool must use this rather
 * than hardcoding either spelling.
 */
declare function getToolName(context: Pick<ToolsetCtx, 'transport'>): (method: ToolsetMethodId) => string;
//#endregion
//#region code/core/.dts-emit/code/core/src/shared/open-service/toolsets/docs/instructions.d.ts
declare const DOCS_TOOLSET_INSTRUCTIONS: string;
//#endregion
//#region code/core/.dts-emit/code/core/src/shared/open-service/toolsets/docs/manifest-formatter/manifest-types.d.ts
declare const ManifestErrorSchema: v.ObjectSchema<{
  readonly name: v.StringSchema<undefined>;
  readonly message: v.StringSchema<undefined>;
}, undefined>;
type ManifestError = v.InferOutput<typeof ManifestErrorSchema>;
declare const StorySchema: v.ObjectSchema<{
  readonly name: v.StringSchema<undefined>;
  readonly description: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly jsDocTags: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ArraySchema<v.StringSchema<undefined>, undefined>, undefined>, undefined>;
  readonly error: v.OptionalSchema<v.ObjectSchema<{
    readonly name: v.StringSchema<undefined>;
    readonly message: v.StringSchema<undefined>;
  }, undefined>, undefined>;
  readonly id: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly snippet: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
}, undefined>;
type Story = v.InferOutput<typeof StorySchema>;
/**
 * A JSON Reference (`{ $ref }`) pointing at a value in another manifest document. Used by the v1
 * (split/ref) format for docgen, story-docs and MDX payloads.
 */
declare const JsonRef: v.ObjectSchema<{
  readonly $ref: v.StringSchema<undefined>;
}, undefined>;
type JsonRef = v.InferOutput<typeof JsonRef>;
/** Inline (v0) docs entry: the full MDX `content` is embedded. */
declare const DocV0: v.ObjectSchema<{
  readonly id: v.StringSchema<undefined>;
  readonly name: v.StringSchema<undefined>;
  readonly title: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly path: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly content: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly error: v.OptionalSchema<v.ObjectSchema<{
    readonly name: v.StringSchema<undefined>;
    readonly message: v.StringSchema<undefined>;
  }, undefined>, undefined>;
}, undefined>;
type DocV0 = v.InferOutput<typeof DocV0>;
declare const SubcomponentManifest: v.ObjectSchema<{
  readonly name: v.StringSchema<undefined>;
  readonly description: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly jsDocTags: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ArraySchema<v.StringSchema<undefined>, undefined>, undefined>, undefined>;
  readonly error: v.OptionalSchema<v.ObjectSchema<{
    readonly name: v.StringSchema<undefined>;
    readonly message: v.StringSchema<undefined>;
  }, undefined>, undefined>;
  readonly path: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly import: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly apiDescription: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly renderer: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly reactDocgen: v.OptionalSchema<v.AnySchema, undefined>;
  readonly reactDocgenTypescript: v.OptionalSchema<v.AnySchema, undefined>;
  readonly reactComponentMeta: v.OptionalSchema<v.AnySchema, undefined>;
}, undefined>;
type SubcomponentManifest = v.InferOutput<typeof SubcomponentManifest>;
/** Inline (v0) component: docgen, stories and attached docs are all embedded. */
declare const ComponentManifestV0: v.ObjectSchema<{
  readonly name: v.StringSchema<undefined>;
  readonly description: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly jsDocTags: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ArraySchema<v.StringSchema<undefined>, undefined>, undefined>, undefined>;
  readonly error: v.OptionalSchema<v.ObjectSchema<{
    readonly name: v.StringSchema<undefined>;
    readonly message: v.StringSchema<undefined>;
  }, undefined>, undefined>;
  readonly path: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly import: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly apiDescription: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly renderer: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly reactDocgen: v.OptionalSchema<v.AnySchema, undefined>;
  readonly reactDocgenTypescript: v.OptionalSchema<v.AnySchema, undefined>;
  readonly reactComponentMeta: v.OptionalSchema<v.AnySchema, undefined>;
  readonly id: v.StringSchema<undefined>;
  readonly stories: v.OptionalSchema<v.ArraySchema<v.ObjectSchema<{
    readonly name: v.StringSchema<undefined>;
    readonly description: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly jsDocTags: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ArraySchema<v.StringSchema<undefined>, undefined>, undefined>, undefined>;
    readonly error: v.OptionalSchema<v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly message: v.StringSchema<undefined>;
    }, undefined>, undefined>;
    readonly id: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly snippet: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  }, undefined>, undefined>, undefined>;
  readonly subcomponents: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ObjectSchema<{
    readonly name: v.StringSchema<undefined>;
    readonly description: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly jsDocTags: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ArraySchema<v.StringSchema<undefined>, undefined>, undefined>, undefined>;
    readonly error: v.OptionalSchema<v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly message: v.StringSchema<undefined>;
    }, undefined>, undefined>;
    readonly path: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly import: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly apiDescription: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly renderer: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly reactDocgen: v.OptionalSchema<v.AnySchema, undefined>;
    readonly reactDocgenTypescript: v.OptionalSchema<v.AnySchema, undefined>;
    readonly reactComponentMeta: v.OptionalSchema<v.AnySchema, undefined>;
  }, undefined>, undefined>, undefined>;
  readonly docs: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ObjectSchema<{
    readonly id: v.StringSchema<undefined>;
    readonly name: v.StringSchema<undefined>;
    readonly title: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly path: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly content: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly error: v.OptionalSchema<v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly message: v.StringSchema<undefined>;
    }, undefined>, undefined>;
  }, undefined>, undefined>, undefined>;
}, undefined>;
type ComponentManifestV0 = v.InferOutput<typeof ComponentManifestV0>;
declare const ComponentManifestMapV0: v.ObjectSchema<{
  readonly v: v.LiteralSchema<0, undefined>;
  readonly components: v.RecordSchema<v.StringSchema<undefined>, v.ObjectSchema<{
    readonly name: v.StringSchema<undefined>;
    readonly description: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly jsDocTags: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ArraySchema<v.StringSchema<undefined>, undefined>, undefined>, undefined>;
    readonly error: v.OptionalSchema<v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly message: v.StringSchema<undefined>;
    }, undefined>, undefined>;
    readonly path: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly import: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly apiDescription: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly renderer: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly reactDocgen: v.OptionalSchema<v.AnySchema, undefined>;
    readonly reactDocgenTypescript: v.OptionalSchema<v.AnySchema, undefined>;
    readonly reactComponentMeta: v.OptionalSchema<v.AnySchema, undefined>;
    readonly id: v.StringSchema<undefined>;
    readonly stories: v.OptionalSchema<v.ArraySchema<v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly description: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly jsDocTags: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ArraySchema<v.StringSchema<undefined>, undefined>, undefined>, undefined>;
      readonly error: v.OptionalSchema<v.ObjectSchema<{
        readonly name: v.StringSchema<undefined>;
        readonly message: v.StringSchema<undefined>;
      }, undefined>, undefined>;
      readonly id: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly snippet: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    }, undefined>, undefined>, undefined>;
    readonly subcomponents: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly description: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly jsDocTags: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ArraySchema<v.StringSchema<undefined>, undefined>, undefined>, undefined>;
      readonly error: v.OptionalSchema<v.ObjectSchema<{
        readonly name: v.StringSchema<undefined>;
        readonly message: v.StringSchema<undefined>;
      }, undefined>, undefined>;
      readonly path: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly import: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly apiDescription: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly renderer: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly reactDocgen: v.OptionalSchema<v.AnySchema, undefined>;
      readonly reactDocgenTypescript: v.OptionalSchema<v.AnySchema, undefined>;
      readonly reactComponentMeta: v.OptionalSchema<v.AnySchema, undefined>;
    }, undefined>, undefined>, undefined>;
    readonly docs: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ObjectSchema<{
      readonly id: v.StringSchema<undefined>;
      readonly name: v.StringSchema<undefined>;
      readonly title: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly path: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly content: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly error: v.OptionalSchema<v.ObjectSchema<{
        readonly name: v.StringSchema<undefined>;
        readonly message: v.StringSchema<undefined>;
      }, undefined>, undefined>;
    }, undefined>, undefined>, undefined>;
  }, undefined>, undefined>;
}, undefined>;
type ComponentManifestMapV0 = v.InferOutput<typeof ComponentManifestMapV0>;
declare const DocsManifestMapV0: v.ObjectSchema<{
  readonly v: v.LiteralSchema<0, undefined>;
  readonly docs: v.RecordSchema<v.StringSchema<undefined>, v.ObjectSchema<{
    readonly id: v.StringSchema<undefined>;
    readonly name: v.StringSchema<undefined>;
    readonly title: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly path: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly content: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly error: v.OptionalSchema<v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly message: v.StringSchema<undefined>;
    }, undefined>, undefined>;
  }, undefined>, undefined>;
}, undefined>;
type DocsManifestMapV0 = v.InferOutput<typeof DocsManifestMapV0>;
/**
 * Shallow (v1) docs entry. The full MDX payload lives behind `mdx.$ref`; `mdx` is optional because
 * the in-process dev index omits it.
 */
declare const DocV1: v.ObjectSchema<{
  readonly id: v.StringSchema<undefined>;
  readonly name: v.StringSchema<undefined>;
  readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly mdx: v.OptionalSchema<v.ObjectSchema<{
    readonly $ref: v.StringSchema<undefined>;
  }, undefined>, undefined>;
  readonly error: v.OptionalSchema<v.ObjectSchema<{
    readonly name: v.StringSchema<undefined>;
    readonly message: v.StringSchema<undefined>;
  }, undefined>, undefined>;
}, undefined>;
type DocV1 = v.InferOutput<typeof DocV1>;
/**
 * Shallow (v1) component index row. Identity and summary are inlined for cheap listing; docgen and
 * story-docs live behind `$ref`s, attached docs behind nested `mdx.$ref`s. `stories` may also be an
 * inline array, which is how a listing built with story ids resolved carries them.
 */
declare const ComponentManifestV1: v.ObjectSchema<{
  readonly id: v.StringSchema<undefined>;
  readonly name: v.StringSchema<undefined>;
  readonly description: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  readonly error: v.OptionalSchema<v.ObjectSchema<{
    readonly name: v.StringSchema<undefined>;
    readonly message: v.StringSchema<undefined>;
  }, undefined>, undefined>;
  readonly docgen: v.OptionalSchema<v.ObjectSchema<{
    readonly $ref: v.StringSchema<undefined>;
  }, undefined>, undefined>;
  readonly stories: v.OptionalSchema<v.UnionSchema<[v.ObjectSchema<{
    readonly $ref: v.StringSchema<undefined>;
  }, undefined>, v.ArraySchema<v.ObjectSchema<{
    readonly name: v.StringSchema<undefined>;
    readonly description: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly jsDocTags: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ArraySchema<v.StringSchema<undefined>, undefined>, undefined>, undefined>;
    readonly error: v.OptionalSchema<v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly message: v.StringSchema<undefined>;
    }, undefined>, undefined>;
    readonly id: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly snippet: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
  }, undefined>, undefined>], undefined>, undefined>;
  readonly docs: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ObjectSchema<{
    readonly id: v.StringSchema<undefined>;
    readonly name: v.StringSchema<undefined>;
    readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly mdx: v.OptionalSchema<v.ObjectSchema<{
      readonly $ref: v.StringSchema<undefined>;
    }, undefined>, undefined>;
    readonly error: v.OptionalSchema<v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly message: v.StringSchema<undefined>;
    }, undefined>, undefined>;
  }, undefined>, undefined>, undefined>;
}, undefined>;
type ComponentManifestV1 = v.InferOutput<typeof ComponentManifestV1>;
declare const ComponentManifestMapV1: v.ObjectSchema<{
  readonly v: v.LiteralSchema<1, undefined>;
  readonly components: v.RecordSchema<v.StringSchema<undefined>, v.ObjectSchema<{
    readonly id: v.StringSchema<undefined>;
    readonly name: v.StringSchema<undefined>;
    readonly description: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly error: v.OptionalSchema<v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly message: v.StringSchema<undefined>;
    }, undefined>, undefined>;
    readonly docgen: v.OptionalSchema<v.ObjectSchema<{
      readonly $ref: v.StringSchema<undefined>;
    }, undefined>, undefined>;
    readonly stories: v.OptionalSchema<v.UnionSchema<[v.ObjectSchema<{
      readonly $ref: v.StringSchema<undefined>;
    }, undefined>, v.ArraySchema<v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly description: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly jsDocTags: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ArraySchema<v.StringSchema<undefined>, undefined>, undefined>, undefined>;
      readonly error: v.OptionalSchema<v.ObjectSchema<{
        readonly name: v.StringSchema<undefined>;
        readonly message: v.StringSchema<undefined>;
      }, undefined>, undefined>;
      readonly id: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly snippet: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    }, undefined>, undefined>], undefined>, undefined>;
    readonly docs: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ObjectSchema<{
      readonly id: v.StringSchema<undefined>;
      readonly name: v.StringSchema<undefined>;
      readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly mdx: v.OptionalSchema<v.ObjectSchema<{
        readonly $ref: v.StringSchema<undefined>;
      }, undefined>, undefined>;
      readonly error: v.OptionalSchema<v.ObjectSchema<{
        readonly name: v.StringSchema<undefined>;
        readonly message: v.StringSchema<undefined>;
      }, undefined>, undefined>;
    }, undefined>, undefined>, undefined>;
  }, undefined>, undefined>;
}, undefined>;
type ComponentManifestMapV1 = v.InferOutput<typeof ComponentManifestMapV1>;
declare const DocsManifestMapV1: v.ObjectSchema<{
  readonly v: v.LiteralSchema<1, undefined>;
  readonly docs: v.RecordSchema<v.StringSchema<undefined>, v.ObjectSchema<{
    readonly id: v.StringSchema<undefined>;
    readonly name: v.StringSchema<undefined>;
    readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly mdx: v.OptionalSchema<v.ObjectSchema<{
      readonly $ref: v.StringSchema<undefined>;
    }, undefined>, undefined>;
    readonly error: v.OptionalSchema<v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly message: v.StringSchema<undefined>;
    }, undefined>, undefined>;
  }, undefined>, undefined>;
}, undefined>;
type DocsManifestMapV1 = v.InferOutput<typeof DocsManifestMapV1>;
/** `components.json`, discriminated on `v` (0 = inline, 1 = split/ref). */
declare const ComponentManifestMap: v.VariantSchema<"v", [v.ObjectSchema<{
  readonly v: v.LiteralSchema<0, undefined>;
  readonly components: v.RecordSchema<v.StringSchema<undefined>, v.ObjectSchema<{
    readonly name: v.StringSchema<undefined>;
    readonly description: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly jsDocTags: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ArraySchema<v.StringSchema<undefined>, undefined>, undefined>, undefined>;
    readonly error: v.OptionalSchema<v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly message: v.StringSchema<undefined>;
    }, undefined>, undefined>;
    readonly path: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly import: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly apiDescription: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly renderer: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly reactDocgen: v.OptionalSchema<v.AnySchema, undefined>;
    readonly reactDocgenTypescript: v.OptionalSchema<v.AnySchema, undefined>;
    readonly reactComponentMeta: v.OptionalSchema<v.AnySchema, undefined>;
    readonly id: v.StringSchema<undefined>;
    readonly stories: v.OptionalSchema<v.ArraySchema<v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly description: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly jsDocTags: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ArraySchema<v.StringSchema<undefined>, undefined>, undefined>, undefined>;
      readonly error: v.OptionalSchema<v.ObjectSchema<{
        readonly name: v.StringSchema<undefined>;
        readonly message: v.StringSchema<undefined>;
      }, undefined>, undefined>;
      readonly id: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly snippet: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    }, undefined>, undefined>, undefined>;
    readonly subcomponents: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly description: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly jsDocTags: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ArraySchema<v.StringSchema<undefined>, undefined>, undefined>, undefined>;
      readonly error: v.OptionalSchema<v.ObjectSchema<{
        readonly name: v.StringSchema<undefined>;
        readonly message: v.StringSchema<undefined>;
      }, undefined>, undefined>;
      readonly path: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly import: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly apiDescription: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly renderer: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly reactDocgen: v.OptionalSchema<v.AnySchema, undefined>;
      readonly reactDocgenTypescript: v.OptionalSchema<v.AnySchema, undefined>;
      readonly reactComponentMeta: v.OptionalSchema<v.AnySchema, undefined>;
    }, undefined>, undefined>, undefined>;
    readonly docs: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ObjectSchema<{
      readonly id: v.StringSchema<undefined>;
      readonly name: v.StringSchema<undefined>;
      readonly title: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly path: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly content: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly error: v.OptionalSchema<v.ObjectSchema<{
        readonly name: v.StringSchema<undefined>;
        readonly message: v.StringSchema<undefined>;
      }, undefined>, undefined>;
    }, undefined>, undefined>, undefined>;
  }, undefined>, undefined>;
}, undefined>, v.ObjectSchema<{
  readonly v: v.LiteralSchema<1, undefined>;
  readonly components: v.RecordSchema<v.StringSchema<undefined>, v.ObjectSchema<{
    readonly id: v.StringSchema<undefined>;
    readonly name: v.StringSchema<undefined>;
    readonly description: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly error: v.OptionalSchema<v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly message: v.StringSchema<undefined>;
    }, undefined>, undefined>;
    readonly docgen: v.OptionalSchema<v.ObjectSchema<{
      readonly $ref: v.StringSchema<undefined>;
    }, undefined>, undefined>;
    readonly stories: v.OptionalSchema<v.UnionSchema<[v.ObjectSchema<{
      readonly $ref: v.StringSchema<undefined>;
    }, undefined>, v.ArraySchema<v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly description: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly jsDocTags: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ArraySchema<v.StringSchema<undefined>, undefined>, undefined>, undefined>;
      readonly error: v.OptionalSchema<v.ObjectSchema<{
        readonly name: v.StringSchema<undefined>;
        readonly message: v.StringSchema<undefined>;
      }, undefined>, undefined>;
      readonly id: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly snippet: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    }, undefined>, undefined>], undefined>, undefined>;
    readonly docs: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.ObjectSchema<{
      readonly id: v.StringSchema<undefined>;
      readonly name: v.StringSchema<undefined>;
      readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
      readonly mdx: v.OptionalSchema<v.ObjectSchema<{
        readonly $ref: v.StringSchema<undefined>;
      }, undefined>, undefined>;
      readonly error: v.OptionalSchema<v.ObjectSchema<{
        readonly name: v.StringSchema<undefined>;
        readonly message: v.StringSchema<undefined>;
      }, undefined>, undefined>;
    }, undefined>, undefined>, undefined>;
  }, undefined>, undefined>;
}, undefined>], undefined>;
type ComponentManifestMap = v.InferOutput<typeof ComponentManifestMap>;
/** `docs.json` for standalone documentation entries, discriminated on `v`. */
declare const DocsManifestMap: v.VariantSchema<"v", [v.ObjectSchema<{
  readonly v: v.LiteralSchema<0, undefined>;
  readonly docs: v.RecordSchema<v.StringSchema<undefined>, v.ObjectSchema<{
    readonly id: v.StringSchema<undefined>;
    readonly name: v.StringSchema<undefined>;
    readonly title: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly path: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly content: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly error: v.OptionalSchema<v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly message: v.StringSchema<undefined>;
    }, undefined>, undefined>;
  }, undefined>, undefined>;
}, undefined>, v.ObjectSchema<{
  readonly v: v.LiteralSchema<1, undefined>;
  readonly docs: v.RecordSchema<v.StringSchema<undefined>, v.ObjectSchema<{
    readonly id: v.StringSchema<undefined>;
    readonly name: v.StringSchema<undefined>;
    readonly summary: v.OptionalSchema<v.StringSchema<undefined>, undefined>;
    readonly mdx: v.OptionalSchema<v.ObjectSchema<{
      readonly $ref: v.StringSchema<undefined>;
    }, undefined>, undefined>;
    readonly error: v.OptionalSchema<v.ObjectSchema<{
      readonly name: v.StringSchema<undefined>;
      readonly message: v.StringSchema<undefined>;
    }, undefined>, undefined>;
  }, undefined>, undefined>;
}, undefined>], undefined>;
type DocsManifestMap = v.InferOutput<typeof DocsManifestMap>;
/** A component index row as it appears in either format. */
type ComponentManifestEntry = ComponentManifestV0 | ComponentManifestV1;
/** A docs index row as it appears in either format. */
type DocEntry = DocV0 | DocV1;
/**
 * A fully-resolved component, as consumed by the formatters: inline shape (stories as an array,
 * attached docs with `content`, docgen inlined). Identical to the v0 shape — v1 rows reach it by
 * following their `$ref`s, or by being built in-process from the open services.
 */
type ComponentManifest = ComponentManifestV0;
/** A fully-resolved docs entry (inline `content`), as consumed by the formatters. */
type Doc = DocV0;
type AllManifests = {
  componentManifest: ComponentManifestMap;
  docsManifest?: DocsManifestMap;
};
//#endregion
//#region code/core/.dts-emit/code/core/src/shared/open-service/toolsets/docs/access.d.ts
/**
 * One fully-assembled entry: docgen, stories, and MDX content already merged. This is the shape the
 * Markdown formatters consume, which is why it uses the inline manifest types rather than the
 * shallow index rows `list` returns.
 */
type ResolvedDocsEntry = {
  kind: 'component';
  component: ComponentManifest;
} | {
  kind: 'doc';
  doc: Doc;
};
type DocsAccess = {
  /** Shallow component + standalone-docs index. Story ids are resolved only when requested. */list(options: {
    withStoryIds: boolean;
  }): Promise<AllManifests>; /** One component or standalone docs entry, fully assembled; undefined when the id is unknown. */
  resolve(id: string): Promise<ResolvedDocsEntry | undefined>;
};
/** A listing with no components and no standalone docs. */
declare function emptyManifests(): AllManifests;
//#endregion
//#region code/core/.dts-emit/code/core/src/shared/open-service/toolsets/docs/sources.d.ts
/** One Storybook in a composition. The local source has no `url`. */
type Source = {
  /** Stable identifier, used as the `storybookId` tool input. */id: string; /** Human-readable title, used as the section header when listing. */
  title: string; /** Remote URL; undefined for the local Storybook. */
  url?: string;
};
type SourceWithUrl = Source & {
  url: string;
};
/** Guidance for a source that can only be read through its own MCP endpoint. */
type RequiresOwnMcpNotice = {
  kind: 'requires-own-mcp';
  endpoint: string;
};
/**
 * One source's contribution to a composed listing. Exactly one of `manifests`, `error` or `notice`
 * carries the outcome, so a failing source occupies its own section instead of the whole listing.
 */
type SourceListing = {
  source: Source;
  manifests?: AllManifests;
  error?: string;
  notice?: RequiresOwnMcpNotice;
};
declare function getSourceMcpEndpoint(source: SourceWithUrl): string;
/**
 * A private composed Storybook cannot be proxied — its credentials belong to the user, not to this
 * server — so the answer is the address the agent should talk to instead.
 */
declare function formatRequiresOwnMcpNotice(source: Source, endpoint: string, options?: {
  includeHeader?: boolean;
}): string;
declare class RequiresOwnMcpError extends Error {
  readonly source: SourceWithUrl;
  readonly endpoint: string;
  constructor(source: SourceWithUrl);
}
/** Thrown when a manifest cannot be fetched or does not parse. */
declare class ManifestGetError extends Error {
  readonly url: string;
  readonly cause?: Error;
  constructor(message: string, url?: string, cause?: Error);
}
//#endregion
//#region code/core/.dts-emit/code/core/src/shared/open-service/toolsets/docs/access-provider.d.ts
/** Where the top-level manifests live, relative to the Storybook build. */
declare const COMPONENT_MANIFEST_PATH = "./manifests/components.json";
declare const DOCS_MANIFEST_PATH = "./manifests/docs.json";
/**
 * Fetches one manifest file by path. `request` is the incoming MCP request, which the default
 * provider uses to derive the origin; custom providers may ignore it.
 */
type ManifestProvider = (request: Request | undefined, path: string, source?: Source) => Promise<string>;
type ProviderDocsAccessOptions = {
  manifestProvider?: ManifestProvider; /** The in-flight request. Read per call, because the access outlives any single request. */
  getRequest?: () => Request | undefined; /** The composed source this access reads, when part of a composition. */
  source?: Source;
  /**
   * Resolves a single entry in-process, bypassing the manifest index. The dev server passes this
   * for its local source when `experimentalDocgenServer` is on, so one lookup never triggers
   * docgen extraction for every component.
   */
  resolveEntry?: (id: string, source?: Source) => Promise<ResolvedDocsEntry | undefined>;
};
/** Fetches and validates the component and docs manifests for one source. */
declare function fetchManifests(request?: Request, manifestProvider?: ManifestProvider, source?: Source): Promise<AllManifests>;
/**
 * Resolves a `$ref` into the provider path of the referenced file and the JSON-pointer segments
 * into it.
 *
 * The path is relative to the component manifest's location, e.g.
 * `"../services/core/docgen/button.json#/components/button"` resolves to
 * `./services/core/docgen/button.json` with pointer `["components", "button"]`.
 */
declare function parseManifestRef(ref: string): {
  path: string;
  pointer: string[];
};
/**
 * Resolves a component index row into a full component manifest by following any `$ref`s it carries
 * (docgen, story-docs, attached MDX), then adapting the payloads into the formatter's shape. Rows
 * without any `$ref` are already in resolved (inline/v0) form and are returned unchanged.
 */
declare function resolveComponentEntry(component: ComponentManifestEntry, request?: Request, manifestProvider?: ManifestProvider, source?: Source): Promise<ComponentManifest>;
/**
 * Resolves only a component's stories `$ref`, leaving docgen and docs refs untouched. Listing with
 * story ids uses this so it doesn't pay for docgen and MDX resolution it won't show.
 */
declare function resolveComponentStories(component: ComponentManifestEntry, request?: Request, manifestProvider?: ManifestProvider, source?: Source): Promise<ComponentManifestEntry>;
/** Resolves a standalone docs row, following its `mdx.$ref` when present. */
declare function resolveDocEntry(doc: DocEntry, request?: Request, manifestProvider?: ManifestProvider, source?: Source): Promise<Doc>;
/** Docs access over manifest files served by a provider. */
declare function createProviderDocsAccess({
  manifestProvider,
  getRequest,
  source,
  resolveEntry
}?: ProviderDocsAccessOptions): DocsAccess;
//#endregion
//#region code/core/.dts-emit/code/core/src/shared/open-service/toolsets/docs/multi-source.d.ts
/** One composed source and the access that reads it. */
type DocsSource = {
  source: Source;
  access: DocsAccess;
};
type CompositionDocsSourcesOptions = {
  sources: Source[];
  manifestProvider?: ManifestProvider;
  getRequest?: () => Request | undefined;
  /**
   * Reads the local Storybook — the source with no `url` — instead of fetching manifests from it.
   * The dev server passes its service-backed access here when `experimentalDocgenServer` is on,
   * where the local `/manifests/*.json` are deliberately 404'd and the data lives in the services.
   */
  localAccess?: DocsAccess;
  /**
   * Resolves a single entry in-process, short-cutting the manifest index. Part of the hosted
   * package's public context, so it stays available to embedders that supply one.
   */
  resolveEntry?: (id: string, source?: Source) => Promise<ResolvedDocsEntry | undefined>;
};
/**
 * Builds one access per composed source.
 *
 * Remote sources are read through the same provider access a single hosted Storybook uses, which is
 * what lets a composition reuse that implementation rather than a parallel one. The local source
 * may instead be handed a ready-made access, so the dev server reads itself the same way in a
 * composition as it does alone.
 */
declare function createCompositionDocsSources({
  sources,
  manifestProvider,
  getRequest,
  localAccess,
  resolveEntry
}: CompositionDocsSourcesOptions): DocsSource[];
/**
 * Lists every source concurrently, turning a failure into that source's own outcome.
 *
 * One unreachable or private source must not cost the agent the entire listing, which is the whole
 * reason each result is captured rather than awaited together.
 */
declare function listSources(sources: DocsSource[], options: {
  withStoryIds: boolean;
}): Promise<SourceListing[]>;
//#endregion
//#region code/core/.dts-emit/code/core/src/shared/open-service/toolsets/docs/definition.d.ts
/**
 * Which Storybooks these tools serve — exactly one of the two.
 *
 * Modelled as an exclusive union so neither "no access at all" nor "both, one silently winning" can
 * be constructed: a composition takes a `storybookId` on every lookup and a single Storybook must
 * not ask for one, and that difference is decided here.
 */
type CreateDocsToolsetOptions = {
  /** Reads the one Storybook these tools serve. */docsAccess: DocsAccess;
  sources?: never;
} | {
  /** The composed Storybooks these tools serve; ids are only unique within a source. */sources: DocsSource[];
  docsAccess?: never;
};
type DocsListOutput = {
  withStoryIds: boolean; /** Single-source listing. */
  manifests?: AllManifests; /** Per-source listings, in composition. */
  sources?: SourceListing[];
};
type DocsShowOutput = {
  id: string;
  entry?: ResolvedDocsEntry;
  storybookId?: string; /** Set when the request named no source, or one that does not exist. */
  sourceError?: string;
};
type DocsShowStoryOutput = {
  componentId?: string;
  storyName?: string;
  storyId?: string;
  entry?: ResolvedDocsEntry;
  storybookId?: string;
  sourceError?: string;
};
/**
 * The manifests a listing should be reported against.
 *
 * Reporting predates composition and describes one Storybook, so a composed listing is reported
 * against the first source that produced one. Nothing is returned when no source did — a listing of
 * nothing but errors is not a usage signal.
 */
declare function selectReportedManifests({
  manifests,
  sources
}: DocsListOutput): AllManifests | undefined;
/**
 * Whether `docs.show` failed: an unusable source, or an id that resolved to nothing.
 *
 * The handlers encode this in the outcome tag; the predicate stays exported because it is part of
 * the frozen `@storybook/mcp` API.
 */
declare function isDocsShowError(output: DocsShowOutput): boolean;
/** Whether `docs.showStory` failed: an unusable source, a missing component, or a missing story. */
declare function isDocsShowStoryError(output: DocsShowStoryOutput): boolean;
declare function describeList(ctx: ToolsetCtx): string;
declare function describeShow(ctx: ToolsetCtx): string;
/**
 * Creates the public docs API over an injected {@link DocsAccess}.
 *
 * The toolset never reads services or manifests itself, so the same definition serves the dev
 * server (open services or the built manifests), a hosted Storybook (manifest files over any
 * provider), and a composition of several of those.
 */
declare function createDocsToolset(options: CreateDocsToolsetOptions): ToolsetDefinition<"docs", {
  readonly list: {
    readonly input: v.ObjectSchema<{
      readonly withStoryIds: v.OptionalSchema<v.SchemaWithPipe<readonly [v.BooleanSchema<undefined>, v.DescriptionAction<boolean, "When true, includes story sub-bullets under each component with story name and story ID. Use this to discover IDs for downstream story-focused workflows without filesystem lookup.">]>, false>;
    }, undefined>;
    readonly title: "List All Documentation";
    readonly description: typeof describeList;
    readonly handler: (input: any) => Promise<ToolsetOutcome<DocsListOutput, never>>;
  };
  readonly show: {
    readonly input: v.ObjectSchema<{
      readonly id: v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.DescriptionAction<string, "The component or docs entry ID (e.g., \"button\")">]>;
    }, undefined>;
    readonly title: "Get Documentation";
    readonly description: typeof describeShow;
    readonly handler: (input: any, ctx: ToolsetCtx) => Promise<ToolsetOutcome<DocsShowOutput>>;
  };
  readonly showStory: {
    readonly input: v.ObjectSchema<{
      storyId: v.SchemaWithPipe<readonly [v.OptionalSchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string | undefined, "The story ID, as listed by the docs list tool with withStoryIds: true and shown next to each story in the component documentation (e.g., \"button--primary\"). Prefer this over componentId + storyName whenever you have a story ID.">]>;
      componentId: v.SchemaWithPipe<readonly [v.OptionalSchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string | undefined, "The component ID (e.g., \"button\"). Use together with storyName, and only when you have no story ID.">]>;
      storyName: v.SchemaWithPipe<readonly [v.OptionalSchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string | undefined, "The human-readable story name (e.g., \"Primary\"). Use together with componentId.">]>;
    }, undefined> | v.ObjectSchema<{
      readonly storybookId: v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.DescriptionAction<string, "The ID of the Storybook source to query (e.g., \"local\", \"design-system\")">]>;
      readonly storyId: v.SchemaWithPipe<readonly [v.OptionalSchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string | undefined, "The story ID, as listed by the docs list tool with withStoryIds: true and shown next to each story in the component documentation (e.g., \"button--primary\"). Prefer this over componentId + storyName whenever you have a story ID.">]>;
      readonly componentId: v.SchemaWithPipe<readonly [v.OptionalSchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string | undefined, "The component ID (e.g., \"button\"). Use together with storyName, and only when you have no story ID.">]>;
      readonly storyName: v.SchemaWithPipe<readonly [v.OptionalSchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string | undefined, "The human-readable story name (e.g., \"Primary\"). Use together with componentId.">]>;
    }, undefined>;
    readonly title: "Get Documentation for Story";
    readonly description: "Get detailed documentation for a specific story variant of a UI component. Use this when you need to see more usage examples of a component, via the stories written for it. Identify the story by its story ID (preferred), or by componentId plus storyName.";
    readonly handler: (input: any, ctx: ToolsetCtx) => Promise<ToolsetOutcome<DocsShowStoryOutput>>;
  };
}>;
type DocsToolset = ReturnType<typeof createDocsToolset>;
//#endregion
//#region code/core/.dts-emit/code/core/src/shared/open-service/toolsets/estimate-tokens.d.ts
/**
 * Estimates token count from text using a fast approximation.
 * Counts:
 * - Continuous whitespace as a single token
 * - Continuous alphanumeric sequences as single tokens
 * - Each special character as an individual token
 *
 * This is a cheap approximation suitable for telemetry purposes.
 *
 * @param text - The text to estimate token count for
 * @returns Estimated token count
 */
declare function estimateTokens(text: string): number;
//#endregion
//#region code/core/.dts-emit/code/core/src/csf/SBType.d.ts
interface SBBaseType {
  required?: boolean;
  raw?: string;
}
type SBScalarType = SBBaseType & {
  name: 'boolean' | 'string' | 'number' | 'function' | 'symbol' | 'date';
};
type SBArrayType = SBBaseType & {
  name: 'array';
  value: SBType;
};
type SBNodeType = SBBaseType & {
  name: 'node';
  renderer: string;
};
type SBObjectType = SBBaseType & {
  name: 'object';
  value: Record<string, SBType>;
};
type SBEnumType = SBBaseType & {
  name: 'enum';
  value: (string | number | null)[];
};
type SBIntersectionType = SBBaseType & {
  name: 'intersection';
  value: SBType[];
};
type SBUnionType = SBBaseType & {
  name: 'union';
  value: SBType[];
};
type SBLiteralType = SBBaseType & {
  name: 'literal';
  value: unknown;
};
type SBTupleType = SBBaseType & {
  name: 'tuple';
  value: SBType[];
};
type SBOtherType = SBBaseType & {
  name: 'other';
  value: string;
};
type SBType = SBScalarType | SBEnumType | SBArrayType | SBNodeType | SBObjectType | SBIntersectionType | SBUnionType | SBLiteralType | SBTupleType | SBOtherType;
//#endregion
//#region code/core/.dts-emit/code/core/src/csf/story.d.ts
type ControlType = 'object' | 'boolean' | 'check' | 'inline-check' | 'radio' | 'inline-radio' | 'select' | 'multi-select' | 'number' | 'range' | 'file' | 'color' | 'date' | 'text';
type ConditionalTest = {
  truthy?: boolean;
} | {
  exists: boolean;
} | {
  eq: any;
} | {
  neq: any;
};
type ConditionalValue = {
  arg: string;
} | {
  global: string;
};
type Conditional = ConditionalValue & ConditionalTest;
interface ControlBase {
  [key: string]: any;
  /** @see https://storybook.js.org/docs/api/arg-types#controltype */
  type?: ControlType;
  disable?: boolean;
}
type Control = ControlType | false | (ControlBase & (ControlBase | {
  type: 'color'; /** @see https://storybook.js.org/docs/api/arg-types#controlpresetcolors */
  presetColors?: string[];
} | {
  type: 'file'; /** @see https://storybook.js.org/docs/api/arg-types#controlaccept */
  accept?: string;
} | {
  type: 'inline-check' | 'radio' | 'inline-radio' | 'select' | 'multi-select'; /** @see https://storybook.js.org/docs/api/arg-types#controllabels */
  labels?: {
    [options: string]: string;
  };
} | {
  type: 'number' | 'range'; /** @see https://storybook.js.org/docs/api/arg-types#controlmax */
  max?: number; /** @see https://storybook.js.org/docs/api/arg-types#controlmin */
  min?: number; /** @see https://storybook.js.org/docs/api/arg-types#controlstep */
  step?: number;
}));
interface InputType {
  /** @see https://storybook.js.org/docs/api/arg-types#control */
  control?: Control;
  /** @see https://storybook.js.org/docs/api/arg-types#description */
  description?: string;
  /** @see https://storybook.js.org/docs/api/arg-types#if */
  if?: Conditional;
  /** @see https://storybook.js.org/docs/api/arg-types#mapping */
  mapping?: {
    [key: string]: any;
  };
  /** @see https://storybook.js.org/docs/api/arg-types#name */
  name?: string;
  /** @see https://storybook.js.org/docs/api/arg-types#options */
  options?: readonly any[];
  /** @see https://storybook.js.org/docs/api/arg-types#table */
  table?: {
    [key: string]: unknown; /** @see https://storybook.js.org/docs/api/arg-types#tablecategory */
    category?: string; /** @see https://storybook.js.org/docs/api/arg-types#tabledefaultvalue */
    defaultValue?: {
      summary?: string | undefined;
      detail?: string | undefined;
    }; /** @see https://storybook.js.org/docs/api/arg-types#tabledisable */
    disable?: boolean; /** @see https://storybook.js.org/docs/api/arg-types#tablesubcategory */
    subcategory?: string; /** @see https://storybook.js.org/docs/api/arg-types#tabletype */
    type?: {
      summary?: string | undefined;
      detail?: string | undefined;
    };
  };
  /** @see https://storybook.js.org/docs/api/arg-types#type */
  type?: SBType | SBScalarType['name'];
  /**
   * @deprecated Use `table.defaultValue.summary` instead.
   * @see https://storybook.js.org/docs/api/arg-types#defaultvalue
   */
  defaultValue?: any;
  [key: string]: any;
}
interface StrictInputType extends InputType {
  name: string;
  type?: SBType;
}
interface Args {
  [name: string]: any;
}
type StrictArgTypes<TArgs = Args> = { [name in keyof TArgs]: StrictInputType };
//#endregion
//#region code/core/.dts-emit/code/core/src/shared/open-service/services/story-docs/types.d.ts
/** Free-form error attached to a story snippet entry. */
interface StoryDocsError {
  name: string;
  message: string;
}
/** Snippet + metadata for one story under a component. */
interface StoryDoc {
  id: string;
  name: string;
  snippet?: string;
  description?: string;
  summary?: string;
  /**
   * What a static pass could not resolve, in the source text it was written as. Next to a
   * `snippet` it marks the example as partial; on its own it says why no static snippet could be
   * produced at all. An `error` means the provider itself failed.
   */
  warning?: string;
  error?: StoryDocsError;
}
/** Story docs keyed by story id for O(1) lookup and fine-grained open-service subscriptions. */
type StoryDocsById = Record<string, StoryDoc>;
//#endregion
//#region code/core/.dts-emit/code/core/src/shared/open-service/services/docgen/types.d.ts
/** Free-form error attached to a payload or subcomponent. */
interface DocgenError {
  name: string;
  message: string;
}
/** Compact JSDoc tag map: tag name → list of tag values (e.g. `@example a` → `{ example: ['a'] }`). */
type DocgenJsDocTags = Record<string, string[]>;
/**
 * Docgen payload returned by `core/docgen`'s `docgen` query.
 *
 * Component-only fields (props, descriptions, subcomponents). Story snippets and file-level
 * imports live in `core/story-docs` when `experimentalDocgenServer` is enabled.
 */
interface DocgenPayload {
  id: string;
  name: string;
  /** CSF story file import path from the index entry (same as component manifest `path`). */
  path: string;
  description?: string;
  summary?: string;
  jsDocTags: DocgenJsDocTags;
  /** Renderer-converted argTypes derived from integration-specific docgen data at write time. */
  argTypes?: StrictArgTypes;
  /**
   * Framework-authored API documentation in Markdown, rendered verbatim in place of the props
   * section. Prefer `##` level headings for sections (Inputs, Outputs, Props, Events, Slots) and TS
   * types for structured data.
   */
  apiDescription?: string;
  /** Renderer id (e.g. `angular`), so a consumer knows which template syntax the component takes. */
  renderer?: string;
  subcomponents?: Record<string, DocgenSubcomponent>;
  error?: DocgenError;
  [key: string]: unknown;
}
/** Component-level summary + docgen for one subcomponent. */
interface DocgenSubcomponent {
  name: string;
  path: string;
  description?: string;
  summary?: string;
  import?: string;
  jsDocTags: DocgenJsDocTags;
  /** Renderer-converted argTypes derived from integration-specific docgen data at write time. */
  argTypes?: StrictArgTypes;
  /** See {@link DocgenPayload.apiDescription}. */
  apiDescription?: string;
  /** See {@link DocgenPayload.renderer}. */
  renderer?: string;
  error?: DocgenError;
  [key: string]: unknown;
}
//#endregion
//#region code/core/.dts-emit/code/core/src/shared/open-service/toolsets/docs/map.d.ts
type MdxDoc = {
  id: string;
  name: string;
  path?: string;
  title?: string;
  content?: string;
  summary?: string;
  error?: {
    name: string;
    message: string;
  };
};
//#endregion
//#region code/core/.dts-emit/code/core/src/shared/open-service/toolsets/docs/manifest-formatter/adapt-core-manifest.d.ts
/**
 * Adapts the `experimentalDocgenServer` open-service payloads into the manifest formatter's
 * {@link ComponentManifest}/{@link Doc} shapes.
 *
 * Only `argTypes` is dropped: the props section comes from `apiDescription` when the framework
 * authored one, else from the `react*` docgen-engine fields. All of those pass through unchanged.
 */
/**
 * A component assembled from the `core/docgen` payload plus the `core/story-docs` stories and
 * resolved attached MDX docs.
 */
type CoreDocgenComponent = Partial<Omit<DocgenPayload, 'id' | 'name'>> & {
  id: string;
  name: string;
  import?: string; /** Story snippets, either as a story-docs record or an already-resolved array. */
  stories?: StoryDocsById | Story[]; /** Attached docs keyed by doc id (resolved MDX payloads). */
  docs?: Record<string, MdxDoc>;
};
/** Converts the story-docs `stories` record (or an already-resolved array) into `Story[]`. */
declare function adaptCoreStories(stories: CoreDocgenComponent['stories']): Story[] | undefined;
/** Adapts one MDX service payload into a {@link Doc}. */
declare function adaptCoreDoc(doc: MdxDoc): Doc;
/** Adapts a core-format component (docgen + story-docs + attached MDX) into a {@link ComponentManifest}. */
declare function adaptCoreComponent(core: CoreDocgenComponent): ComponentManifest;
//#endregion
//#region code/core/.dts-emit/code/core/src/shared/open-service/toolsets/docs/manifest-formatter/extract-docs-summary.d.ts
/**
 * Maximum length for a summary before truncation.
 */
declare const MAX_SUMMARY_LENGTH = 90;
/**
 * Extracts a summary from MDX content.
 * The summary is created by:
 * 1. Removing import statements
 * 2. Removing JSX/MDX expressions
 * 3. Extracting only text content from JSX/HTML elements
 * 4. Truncating to MAX_SUMMARY_LENGTH characters if needed
 *
 * @param content - The MDX content string
 * @returns A summary string, or undefined if no meaningful text content is found
 */
declare function extractDocsSummary(content: string): string | undefined;
//#endregion
//#region code/core/.dts-emit/code/core/src/shared/open-service/toolsets/docs/manifest-formatter/markdown.d.ts
/**
 * Maximum number of stories to show in full detail in component manifests.
 * Remaining stories will be shown as names only.
 */
declare const MAX_STORIES_TO_SHOW = 3;
type ListFormattingOptions = {
  withStoryIds?: boolean;
};
/**
 * Format a single component manifest into markdown.
 */
declare function formatComponentManifest(componentManifest: ComponentManifest): string;
/**
 * Format a single doc manifest into markdown.
 */
declare function formatDocsManifest(doc: Doc): string;
/**
 * Format a component manifest map into a markdown list.
 * @param manifest - The component manifest map to format
 * @returns Formatted string representation of the component list
 */
declare function formatManifestsToLists(manifests: AllManifests, options?: ListFormattingOptions): string;
/**
 * Format a single story's documentation.
 */
declare function formatStoryDocumentation(componentManifest: ComponentManifest, storyName: string): string;
//#endregion
//#region code/core/.dts-emit/code/core/src/shared/open-service/toolsets/docs/manifest-formatter/parse-react-docgen.d.ts
/**
 * The single implementation of react-docgen prop parsing, shared by the dev server and the hosted
 * `@storybook/mcp` package, which bundles this entry. Core does not depend on `react-docgen` /
 * `react-docgen-typescript`, so the type-only imports are the structural subsets the parsers
 * actually read rather than those packages' own types.
 */
type ParsedDocgen = {
  tags?: Record<string, string[]>;
  props: Record<string, {
    description?: string;
    type?: string;
    defaultValue?: string;
    required?: boolean;
  }>;
};
/** Structural subset of react-docgen's `tsType` / `type` prop descriptor field. */
type TsType = {
  name?: string;
  raw?: string;
  value?: string;
  type?: string;
  elements?: TsType[];
  signature?: {
    arguments?: Array<{
      name: string;
      type?: TsType;
    }>;
    return?: TsType;
    properties?: Array<{
      key: unknown;
      value?: TsType & {
        required?: boolean;
      };
    }>;
  };
};
/** Structural subset of react-docgen's `Documentation` output. */
type Documentation = {
  props?: Record<string, {
    description?: string;
    required?: boolean;
    tsType?: TsType;
    type?: TsType;
    defaultValue?: {
      value?: string;
    };
  }>;
};
/** Structural subset of react-docgen-typescript's `ComponentDoc` output. */
type ComponentDoc = {
  tags?: Record<string, unknown>;
  props?: Record<string, {
    description?: string;
    required?: boolean;
    type?: {
      name?: string;
      raw?: string;
    };
    defaultValue?: {
      value?: string;
    } | null;
  }>;
};
type ComponentDocLike = Pick<ComponentDoc, 'props' | 'tags'>;
declare const parseReactDocgen: (reactDocgen: Documentation) => ParsedDocgen;
declare const parseReactDocgenTypescript: (reactDocgenTypescript: ComponentDoc) => ParsedDocgen;
declare const parseReactComponentMeta: (reactComponentMeta: ComponentDocLike) => ParsedDocgen;
//#endregion
export { type AllManifests, COMPONENT_MANIFEST_PATH, type ComponentManifest, type ComponentManifestEntry, ComponentManifestMap, ComponentManifestMapV0, ComponentManifestMapV1, type ComponentManifestV0, type ComponentManifestV1, type CompositionDocsSourcesOptions, type CoreDocgenComponent, type CreateDocsToolsetOptions, DOCS_MANIFEST_PATH, DOCS_TOOLSET_INSTRUCTIONS, type Doc, type DocEntry, type DocV0, type DocV1, type DocsAccess, type DocsListOutput, DocsManifestMap, DocsManifestMapV0, DocsManifestMapV1, type DocsShowOutput, type DocsShowStoryOutput, type DocsSource, type DocsToolset, JsonRef, MAX_STORIES_TO_SHOW, MAX_SUMMARY_LENGTH, type ManifestError, ManifestGetError, type ManifestProvider, type ParsedDocgen, type ProviderDocsAccessOptions, RequiresOwnMcpError, type RequiresOwnMcpNotice, type ResolvedDocsEntry, type Source, type SourceListing, type Story, type SubcomponentManifest, type ToolsetCtx, type ToolsetMethodId, type ToolsetOutcome, adaptCoreComponent, adaptCoreDoc, adaptCoreStories, createCompositionDocsSources, createDocsToolset, createProviderDocsAccess, emptyManifests, estimateTokens, extractDocsSummary, fetchManifests, formatComponentManifest, formatDocsManifest, formatManifestsToLists, formatRequiresOwnMcpNotice, formatStoryDocumentation, getSourceMcpEndpoint, getToolName, isDocsShowError, isDocsShowStoryError, listSources, parseManifestRef, parseReactComponentMeta, parseReactDocgen, parseReactDocgenTypescript, resolveComponentEntry, resolveComponentStories, resolveDocEntry, resolveToolsetDescription, selectReportedManifests, toMcpToolName };