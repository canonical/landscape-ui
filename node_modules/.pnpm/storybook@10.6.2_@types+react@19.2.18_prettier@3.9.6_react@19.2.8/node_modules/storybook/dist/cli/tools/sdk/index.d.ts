import { d as ToolsetOutcome } from "../../../chunk-BeknTQDg.js";
import { m as Channel } from "../../../chunk-C6lBDsEa.js";
import { C as attachGateReasonFromError, E as StorybookInstanceRecord, S as ToolsRuntimeErrorReason, T as ToolsRuntime, _ as AttachUnavailableReason, a as ToolsCallOptions, b as ToolsAttachGateReason, c as ToolsHostKind, d as ToolsStorybookInfo, f as ToolsetCatalog, g as AttachUnavailableError, h as ToolsetJsonSchema, i as Tools, l as ToolsMode, m as ToolsetCatalogMethod, n as CreateToolsOptions, o as ToolsClientInfo, p as ToolsetCatalogEntry, r as LocalTools, s as ToolsDescribeOptions, t as AttachedTools, u as ToolsSiblingInstance, v as EnvironmentMismatchError, w as isAttachGateError, x as ToolsRuntimeError, y as SpawnFailedError } from "../../../chunk-BrN9uGgS.js";
import { fork } from "node:child_process";
import { logger } from "storybook/internal/node-logger";

//#region code/core/.dts-emit/code/core/src/cli/tools/sdk/node-channel.d.ts
interface NodeChannelConnection {
  channel: Channel;
  connected: Promise<void>;
  disconnected: Promise<never>;
  close(): void;
}
//#endregion
//#region code/core/.dts-emit/code/core/src/cli/tools/sdk/attached-runtime.d.ts
type AttachedInProcessResult = {
  kind: 'in-process';
  runtime: ToolsRuntime;
  record: StorybookInstanceRecord; /** Instances that also matched the target project but were not selected, best first. */
  siblings: StorybookInstanceRecord[];
  connection: Pick<NodeChannelConnection, 'close' | 'disconnected'>;
};
type AttachedSpawnResult = {
  kind: 'spawn';
  record: StorybookInstanceRecord; /** The instance's verified installation root the child host must be resolved from. */
  storybookPath: string; /** Instances that also matched the target project but were not selected, best first. */
  siblings: StorybookInstanceRecord[];
};
type AttachedBootstrapResult = AttachedInProcessResult | AttachedSpawnResult;
//#endregion
//#region code/core/.dts-emit/code/core/src/cli/tools/sdk/child-client.d.ts
type SpawnChildHostDeps = {
  fork?: typeof fork;
  resolveScript?: (cwd: string) => string;
  logger?: Pick<typeof logger, 'log' | 'warn'>;
};
declare function spawnChildHost(args: {
  cwd: string;
  installationPath?: string;
  options: CreateToolsOptions & {
    mode: 'local';
  };
  clientInfo: Required<ToolsClientInfo>;
  requestedMode: ToolsMode;
}, deps?: SpawnChildHostDeps): Promise<LocalTools>;
declare function spawnChildHost(args: {
  cwd: string;
  installationPath?: string;
  options: CreateToolsOptions & {
    mode: 'attached';
  };
  clientInfo: Required<ToolsClientInfo>;
  requestedMode: ToolsMode;
}, deps?: SpawnChildHostDeps): Promise<AttachedTools>;
declare function spawnChildHost(args: {
  cwd: string;
  installationPath?: string;
  options: CreateToolsOptions;
  clientInfo: Required<ToolsClientInfo>;
  requestedMode: ToolsMode;
}, deps?: SpawnChildHostDeps): Promise<Tools>;
//#endregion
//#region code/core/.dts-emit/code/core/src/cli/tools/sdk/create-tools.d.ts
/**
 * The in-process attach shape `createTools` consumes: the fields of
 * {@link AttachedInProcessResult} it reads, with the record narrowed to identifying info so tests
 * can hand a minimal instance.
 */
type AttachedInProcess = {
  runtime: ToolsRuntime;
  record: {
    url: string;
    pid: number;
    configDir?: string;
    cwd?: string;
    port?: number;
  };
  siblings?: StorybookInstanceRecord[];
  connection: {
    close(): void;
    disconnected: Promise<never>;
  };
};
/** Injectable dependencies for tests. Not part of the public SDK. */
type CreateToolsDeps = {
  bootstrap?: (target: {
    cwd?: string;
    configDir?: string;
  }) => Promise<ToolsRuntime>;
  attach?: (target: {
    cwd?: string;
    configDir?: string;
    port?: number;
  }, deps?: unknown) => Promise<AttachedBootstrapResult | AttachedInProcess>;
  spawnChild?: typeof spawnChildHost;
};
/**
 * Resolve a host for the tools the target Storybook configuration registers.
 *
 * `local` loads that configuration without a running Storybook. When this process is already in
 * the target directory, it loads in-process. Otherwise it spawns a child host from the `storybook`
 * package resolved under that directory. It never changes `process.cwd()`.
 *
 * `attached` joins a running Storybook over its channel and never changes `process.cwd()`. Two
 * processes never attach across `storybook` installations: when this process is the instance's
 * installation (compared by the package root each side derives from its own module location), it
 * joins in-process; when it is a different installation, it spawns a child host from the
 * installation the instance recorded and proxies through it.
 *
 * `auto` tries `attached` first and, on a gate failure, loads `local` instead. A missing instance
 * is the expected auto path and stays silent. Unexpected gate failures carry `fallbackNotice`.
 *
 * @throws {ToolsRuntimeError} With reason `config-load-failed` when the target configuration cannot
 *   be loaded, or `mode-unavailable` when a foreign `cwd` needs a child host and `autoSpawn` is
 *   declined.
 * @throws {AttachUnavailableError} When `attached` cannot find or reach a matching instance.
 * @throws {EnvironmentMismatchError} When the instance record cannot prove which installation it
 *   runs, or the installations differ and spawning is not allowed (`autoSpawn: false`, or this
 *   process is already a child host).
 * @throws {SpawnFailedError} When a child host cannot be resolved or started.
 */
declare function createTools(options: CreateToolsOptions & {
  mode: 'local';
}, deps?: CreateToolsDeps): Promise<LocalTools>;
declare function createTools(options: CreateToolsOptions & {
  mode: 'attached';
}, deps?: CreateToolsDeps): Promise<AttachedTools>;
declare function createTools(options?: CreateToolsOptions, deps?: CreateToolsDeps): Promise<Tools>;
//#endregion
//#region code/core/.dts-emit/code/core/src/cli/tools/sdk/attach-messages.d.ts
/**
 * Out-of-band warning for a run that attached while sibling instances also matched the project.
 * Rendered to stderr, never into the result, so `--json` and `-o` output stay clean.
 */
declare function formatMultiInstanceNotice(storybook: Pick<ToolsStorybookInfo, 'url' | 'port' | 'pid' | 'cwd' | 'configDir' | 'siblings'>): string;
//#endregion
export { AttachUnavailableError, type AttachUnavailableReason, type AttachedTools, type CreateToolsDeps, type CreateToolsOptions, EnvironmentMismatchError, type LocalTools, SpawnFailedError, type Tools, type ToolsAttachGateReason, type ToolsCallOptions, type ToolsClientInfo, type ToolsDescribeOptions, type ToolsHostKind, type ToolsMode, type ToolsRuntime, ToolsRuntimeError, type ToolsRuntimeErrorReason, type ToolsSiblingInstance, type ToolsStorybookInfo, type ToolsetCatalog, type ToolsetCatalogEntry, type ToolsetCatalogMethod, type ToolsetJsonSchema, type ToolsetOutcome, attachGateReasonFromError, createTools, formatMultiInstanceNotice, isAttachGateError };