import { o as ToolsetGetService, r as InvokedToolsetOutcome, t as AnyToolsetDefinition } from "./chunk-BeknTQDg.js";
import { Bc as NumberSchema, Et as StorybookError, Fc as InferOutput, Gc as SchemaWithPipe, Hc as OptionalSchema, Ic as IntegerAction, Kc as StringSchema, Lc as LiteralSchema, Rc as MaxValueAction, Uc as PicklistSchema, Vc as ObjectSchema, Zc as ToolsetMethodId, zc as MinValueAction } from "./chunk-DY6-qCWl.js";

//#region code/core/.dts-emit/code/core/src/cli/tools/instances/types.d.ts
/**
 * A single Storybook runtime record written under the registry dir (default
 * `~/.storybook/instances`). One file per running `storybook dev` instance.
 * Spec: storybookjs/storybook#34826.
 */
declare const StorybookInstanceRecordSchema: ObjectSchema<{
  readonly schemaVersion: LiteralSchema<1, undefined>;
  readonly instanceId: StringSchema<undefined>;
  readonly pid: SchemaWithPipe<readonly [NumberSchema<undefined>, MinValueAction<number, 1, undefined>, IntegerAction<number, undefined>]>;
  readonly cwd: StringSchema<undefined>;
  /**
   * Resolved config directory of the running Storybook, used as a second matching key so
   * monorepo instances are found from a different cwd (storybookjs/storybook#35359). Optional:
   * records written by Storybooks older than 10.5 lack it.
   */
  readonly configDir: OptionalSchema<StringSchema<undefined>, undefined>;
  readonly url: StringSchema<undefined>;
  readonly port: SchemaWithPipe<readonly [NumberSchema<undefined>, MinValueAction<number, 1, undefined>, MaxValueAction<number, 65535, undefined>, IntegerAction<number, undefined>]>;
  /**
   * Token authenticating clients against the instance's WebSocket channel. Optional: records
   * written by older Storybooks lack it.
   */
  readonly token: OptionalSchema<StringSchema<undefined>, undefined>;
  readonly agent: OptionalSchema<StringSchema<undefined>, undefined>;
  readonly storybookVersion: OptionalSchema<StringSchema<undefined>, undefined>;
  /**
   * Realpathed root of the `storybook` package the dev server actually runs, recorded by the
   * server from its own module location. The caller attaches in-process when this equals its own
   * root, and spawns its child host from this root otherwise. Optional: records written by older
   * Storybooks lack it, which makes attach refuse.
   */
  readonly storybookPath: OptionalSchema<StringSchema<undefined>, undefined>;
  readonly startedAt: OptionalSchema<StringSchema<undefined>, undefined>;
  readonly updatedAt: OptionalSchema<StringSchema<undefined>, undefined>;
  readonly mcp: ObjectSchema<{
    readonly status: PicklistSchema<["not-installed", "starting", "ready", "error"], undefined>;
    readonly endpoint: OptionalSchema<StringSchema<undefined>, undefined>;
  }, undefined>;
}, undefined>;
type StorybookInstanceRecord = InferOutput<typeof StorybookInstanceRecordSchema>;
//#endregion
//#region code/core/.dts-emit/code/core/src/cli/tools/sdk/local-runtime.d.ts
type ToolsRuntime = {
  configDir: string;
  toolsets: AnyToolsetDefinition[];
  getService: ToolsetGetService;
  close(): Promise<void>;
};
//#endregion
//#region code/core/.dts-emit/code/core/src/cli/tools/sdk/errors.d.ts
/** Why attaching to a running Storybook was not possible. */
type AttachUnavailableReason = 'no-instance' | 'port-mismatch' | 'old-server' | 'connection-failed';
/**
 * The requested capability needs a running Storybook and the SDK could not attach to one.
 *
 * `remediation` is the whole message: it is written for the agent or developer that triggered the
 * call and names the next step, which is what `agentFacing` declares. `instances` carries every
 * live record the SDK knows about so a caller can point at another project or resolve a
 * `port-mismatch` failure itself. Channel tokens are omitted so logging the error cannot leak
 * them.
 */
declare class AttachUnavailableError extends StorybookError {
  data: {
    reason: AttachUnavailableReason;
    instances: StorybookInstanceRecord[];
    remediation: string;
  };
  constructor(data: {
    reason: AttachUnavailableReason;
    instances: StorybookInstanceRecord[];
    remediation: string;
  });
}
/**
 * The instance record cannot prove which `storybook` installation the running Storybook is, or
 * the installations differ and spawning a child host from the recorded one is not allowed
 * (`autoSpawn: false`, or this process is already a child host). `reason` is the whole message
 * and names the recovery.
 */
declare class EnvironmentMismatchError extends StorybookError {
  data: {
    reason: string;
  };
  constructor(data: {
    reason: string;
  });
}
/** The child host that would run the target project's tools could not be resolved or started. */
declare class SpawnFailedError extends StorybookError {
  data: {
    reason: string;
    cause?: unknown;
  };
  constructor(data: {
    reason: string;
    cause?: unknown;
  });
}
/** Why a tools runtime fault was raised. */
type ToolsRuntimeErrorReason = 'mode-unavailable' | 'config-load-failed' | 'closed' | 'unknown-toolset' | 'unknown-method' | 'invalid-input' | 'connection-lost' | 'command-unhandled';
/**
 * A tools runtime fault: the SDK could not run what was asked of it.
 *
 * Distinct from a tool that ran and reported bad news, which is an outcome with `ok: false` and
 * never an exception.
 */
declare class ToolsRuntimeError extends StorybookError {
  data: {
    reason: ToolsRuntimeErrorReason;
    message: string;
    cause?: unknown; /** Schema issues when `reason` is `invalid-input`. */
    issues?: ReadonlyArray<{
      message: string;
      path?: ReadonlyArray<PropertyKey | {
        key?: unknown;
      }>;
    }>;
  };
  constructor(data: {
    reason: ToolsRuntimeErrorReason;
    message: string;
    cause?: unknown; /** Schema issues when `reason` is `invalid-input`. */
    issues?: ReadonlyArray<{
      message: string;
      path?: ReadonlyArray<PropertyKey | {
        key?: unknown;
      }>;
    }>;
  });
}
declare function isAttachGateError(error: unknown): error is AttachUnavailableError | EnvironmentMismatchError | SpawnFailedError;
/** Why attached mode was not used, either as a hard failure or as an `auto` fallback. */
type ToolsAttachGateReason = AttachUnavailableReason | 'environment-mismatch' | 'spawn-failed';
declare function attachGateReasonFromError(error: AttachUnavailableError | EnvironmentMismatchError | SpawnFailedError): ToolsAttachGateReason;
declare function attachGateReasonFromError(error: unknown): ToolsAttachGateReason | undefined;
//#endregion
//#region code/core/.dts-emit/code/core/src/cli/tools/sdk/json-schema.d.ts
/** A JSON Schema document, as produced from a toolset method's input or output schema. */
type ToolsetJsonSchema = Record<string, unknown>;
//#endregion
//#region code/core/.dts-emit/code/core/src/cli/tools/sdk/types.d.ts
/**
 * How the SDK hosts the target project's tools.
 *
 * `attached` talks to a running Storybook dev server. `local` loads the target configuration
 * without one: in this process when `cwd` already matches, otherwise in a child host started from
 * that directory. `auto` prefers attached and falls back to local.
 */
type ToolsMode = 'auto' | 'attached' | 'local';
type ToolsHostKind = 'in-process' | 'child';
/** Identifies the surface calling the SDK, for the attach handshake and for telemetry. */
type ToolsClientInfo = {
  name: string;
  version: string; /** Defaults to `sdk`; first-party surfaces stamp their own, as the `storybook tools` CLI does. */
  kind?: 'sdk' | 'cli';
};
type CreateToolsOptions = {
  /** Project directory of the target Storybook; defaults to `process.cwd()`. */cwd?: string; /** Directory to load the Storybook configuration from; relative paths resolve from `cwd`. */
  configDir?: string; /** Port of a running Storybook; a known port targets that instance without cwd or config dir. */
  port?: number; /** Defaults to `auto`. */
  mode?: ToolsMode; /** Whether the SDK may start a child host in the target project's own environment. */
  autoSpawn?: boolean;
  clientInfo?: ToolsClientInfo;
};
/** A running instance that also matched the target project but was not attached to. */
type ToolsSiblingInstance = {
  url: string;
  port: number;
  pid: number;
  cwd: string;
  configDir?: string;
};
/** What the resolved host knows about the Storybook it serves. */
type ToolsStorybookInfo = {
  version: string;
  configDir: string; /** Base URL of the running Storybook, including any deployment subpath. */
  url?: string; /** Process id of the running Storybook. */
  pid?: number; /** Port of the running Storybook, as recorded by `storybook dev`. */
  port?: number; /** Directory the running Storybook was started from. */
  cwd?: string;
  /**
   * Set when attach chose among several matching instances: the competing instances, best first,
   * so callers can warn and name `port` as the way to target another one.
   */
  siblings?: ToolsSiblingInstance[];
};
/** One callable tool, described for an agent that has only this catalog to go on. */
type ToolsetCatalogMethod = {
  /** Dotted `toolsetId.methodName`, as passed to {@link Tools.call}. */ref: ToolsetMethodId;
  title: string;
  description: string;
  requiresDevServer: boolean; /** `undefined` when the method's schema has no JSON Schema representation. */
  input: ToolsetJsonSchema | undefined;
  output?: ToolsetJsonSchema;
};
type ToolsetCatalogEntry = {
  id: string;
  description: string;
  methods: ToolsetCatalogMethod[];
};
/** Every tool the target Storybook configuration registers. */
type ToolsetCatalog = {
  configDir: string;
  toolsets: ToolsetCatalogEntry[];
};
type ToolsDescribeOptions = {
  /** Restrict the catalog to one toolset id. */toolset?: string;
};
type ToolsCallOptions = {
  signal?: AbortSignal; /** Overrides the host's Storybook origin for this call. */
  origin?: string;
};
type ToolsBase = {
  clientInfo: Required<ToolsClientInfo>;
  storybook: ToolsStorybookInfo; /** The `mode` passed to `createTools`; `auto` when omitted. */
  requestedMode: ToolsMode; /** `in-process` unless this host is a project-local child. */
  host: ToolsHostKind; /** Set when `auto` mode could not attach for an unexpected reason and loaded locally instead. */
  fallbackNotice?: string; /** Why `auto` loaded locally instead of attaching. */
  fallbackReason?: ToolsAttachGateReason; /** Toolset registry and service accessor for an in-process host. Empty when this host is a child. */
  runtime: ToolsRuntime;
  describe(options?: ToolsDescribeOptions): Promise<ToolsetCatalog>;
  /**
   * Run one tool by its dotted `toolsetId.methodName` reference.
   *
   * A tool that ran and reported bad news resolves to an outcome with `ok: false`; only a fault
   * that stopped the tool from running rejects.
   *
   * @throws {ToolsRuntimeError} When the reference is unknown, the input fails the method's
   *   schema, or the host can no longer serve calls.
   * @throws {AttachUnavailableError} When the method needs a running Storybook the host has not
   *   attached to.
   */
  call(ref: string, input?: Record<string, unknown>, options?: ToolsCallOptions): Promise<InvokedToolsetOutcome>;
  close(): Promise<void>;
};
/**
 * A host that loaded the target configuration without a running Storybook.
 */
type LocalTools = ToolsBase & {
  mode: 'local';
};
/** A host that joined a running Storybook over its channel. */
type AttachedTools = ToolsBase & {
  mode: 'attached';
};
type Tools = LocalTools | AttachedTools;
//#endregion
export { attachGateReasonFromError as C, StorybookInstanceRecord as E, ToolsRuntimeErrorReason as S, ToolsRuntime as T, AttachUnavailableReason as _, ToolsCallOptions as a, ToolsAttachGateReason as b, ToolsHostKind as c, ToolsStorybookInfo as d, ToolsetCatalog as f, AttachUnavailableError as g, ToolsetJsonSchema as h, Tools as i, ToolsMode as l, ToolsetCatalogMethod as m, CreateToolsOptions as n, ToolsClientInfo as o, ToolsetCatalogEntry as p, LocalTools as r, ToolsDescribeOptions as s, AttachedTools as t, ToolsSiblingInstance as u, EnvironmentMismatchError as v, isAttachGateError as w, ToolsRuntimeError as x, SpawnFailedError as y };