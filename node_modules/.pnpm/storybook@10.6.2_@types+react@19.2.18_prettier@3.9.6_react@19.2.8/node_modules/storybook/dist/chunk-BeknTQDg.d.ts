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
/** File map used by static snapshot building. Each key represents one serialized state snapshot. */
type StaticStore = Record<string, unknown>;
/** Generic Standard Schema constraint used across open-service definitions. */
type AnySchema$1 = StandardSchemaV1<unknown, unknown>;
/** Stable alias for service identifiers across definition, runtime, and registration APIs. */
type ServiceId = string;
/**
 * Constrains a service's state to a plain object — the only shape the architecture supports.
 *
 * This is not an arbitrary restriction; two layers require it:
 *
 * 1. State is wrapped in a `deepSignal` proxy for fine-grained per-field reactivity, and `deepSignal`
 *    throws ("this object can't be observed") on primitives, `null`, and `undefined` — there are no
 *    fields to track on a scalar.
 * 2. Cross-peer sync (`applyStatePatch` in `service-sync.ts`) merges state by walking object keys;
 *    it has no notion of replacing a whole scalar, so the wire protocol only carries keyed objects.
 *
 * Arrays are technically observable by `deepSignal` but are still rejected here: `applyStatePatch`
 * replaces arrays wholesale rather than merging by key, so a *top-level* array state would silently
 * fail to sync between peers. Wrap collections in a field instead (`{ items: [...] }`).
 *
 * Authoring helpers pair this with an `extends object` bound (which rejects primitives, `null`, and
 * `undefined` while still accepting both `interface` and `type` declarations). The naked `TState` in
 * the intersection keeps it transparent to inference; only an array collapses to the branded error.
 */
type ServiceState<TState> = TState & (TState extends readonly unknown[] ? {
  __openServiceStateError: 'Service state must be a plain object, not an array.';
} : unknown);
/** Public schema shape exposed when describing a schema-backed service contract. */
type SchemaDescriptor = AnySchema$1;
/** Raw caller-facing value type accepted by a schema-backed operation. */
type InferSchemaInput<TSchema extends AnySchema$1> = StandardSchemaV1.InferInput<TSchema>;
/** Parsed value type produced by a schema after validation. */
type InferSchemaOutput<TSchema extends AnySchema$1> = StandardSchemaV1.InferOutput<TSchema>;
/**
 * Named schema maps are the core inference surface for inline open-service authoring.
 *
 * `defineService()` infers one input-schema map and one output-schema map per operation family
 * (queries and commands). Keeping those maps separate gives TypeScript a place to correlate the
 * `input` and `output` properties of each inline object before it contextually types sibling
 * callbacks like `handler`, `load`, `staticPath`, and `staticInputs`.
 */
type OperationInputSchemas = Record<string, AnySchema$1>;
/**
 * Output-schema maps must stay key-aligned with their input-schema map.
 *
 * The authoring helper uses this alias instead of a plain `Record<string, AnySchema>` so each
 * operation key retains its own input/output schema pair during inference.
 */
type MatchingOutputSchemas<TInputSchemas extends OperationInputSchemas> = { [TKey in keyof TInputSchemas]: AnySchema$1 };
/**
 * Internal utility used to keep handler maps assignable without collapsing everything to `unknown`.
 */
type BivariantCallback<TArgs extends unknown[], TResult> = {
  bivarianceHack(...args: TArgs): TResult;
}['bivarianceHack'];
/** Runtime shape shared by all command collections after they are built. */
type Command = Record<string, (input: unknown) => Promise<unknown>>;
/**
 * Runtime command map derived directly from the inferred command schema maps.
 *
 * Queries only need command-call typing, not the full command definition objects, so this helper
 * keeps query contexts readable while still preserving exact input/output types per command.
 */
type CommandFunctions<TCommandInputSchemas extends OperationInputSchemas, TCommandOutputSchemas extends MatchingOutputSchemas<TCommandInputSchemas>> = { [TKey in keyof TCommandInputSchemas]: BivariantCallback<[input: InferSchemaInput<TCommandInputSchemas[TKey]>], Promise<InferSchemaOutput<TCommandOutputSchemas[TKey]>>> };
/**
 * Coarse lifecycle of a query's `load`, modeled after TanStack Query's `status`.
 *
 * - `pending` — no successful load has completed yet (and none has failed). The query may still
 *   expose `data` (the synchronous "current best" handler result), but nothing has been loaded.
 * - `error` — the most recent attempt (load rejection, or a synchronous handler / validation throw)
 *   failed. `data` keeps the last successful value, if any.
 * - `success` — a load has completed (or the query has no `load`, so there is nothing to load).
 */
type QueryStatus = 'pending' | 'error' | 'success';
/**
 * Whether a `load` is currently running, modeled after TanStack Query's `fetchStatus` — but named
 * with our own `load` vocabulary because open-service "loads" are any slow async work (computation,
 * extraction, I/O), not specifically remote fetching.
 *
 * - `loading` — a `load` is in flight (the first load, or a reactive background re-load).
 * - `idle` — no `load` is currently running.
 */
type LoadStatus = 'loading' | 'idle';
/**
 * The reactive state of a subscribed query: its current `data` plus the lifecycle of its `load`.
 *
 * `data` and `status` are independent. `data` is the synchronous handler result ("current best
 * effort") and holds the last successful value (or `undefined` before the first success / when a
 * handler throws), while `status`/`loadStatus`/`error` describe the asynchronous `load` lifecycle
 * tracked per subscription. A query with no `load` is `success`/`idle` from its first emission.
 *
 * `isLoading` is intentionally "any load in flight" (TanStack's `isFetching`), and
 * `isInitialLoading` is "a load is in flight and there is nothing to show yet"; the names follow our
 * `load` vocabulary rather than TanStack's `fetch`/`load` split. Unlike TanStack Query, a
 * subscription here can attach to a query whose `data` is already cached in service state, so
 * `isInitialLoading` additionally requires `data === undefined` — it never flags over cached data.
 */
type QueryState<TData> = {
  /** Last successfully produced value; `undefined` before the first success. */data: TData | undefined; /** The failure that produced `status: 'error'`, otherwise `undefined`. */
  error: Error | undefined;
  status: QueryStatus;
  loadStatus: LoadStatus; /** `status === 'pending'`. */
  isPending: boolean; /** `status === 'success'`. */
  isSuccess: boolean; /** `status === 'error'`. */
  isError: boolean; /** `loadStatus === 'loading'` — any load in flight, foreground or background. */
  isLoading: boolean; /** `isPending && isLoading && data === undefined` — a first load with nothing to show yet. */
  isInitialLoading: boolean; /** `isLoading && !isPending` — a background re-load while data is already shown. */
  isRefreshing: boolean;
};
/**
 * Public runtime shape of a query.
 *
 * - `.get(input)` reads synchronously: it validates input, runs the handler against current state,
 *   and returns the validated result. It does **not** fire the query's `load` — it is a pure
 *   "current best effort" read. (Reads of *other* queries from inside a handler or `load` body still
 *   participate in dependency tracking, so `.loaded()` and subscriptions trigger those dependency
 *   loads; a bare consumer `.get()` does not.)
 * - `.loaded(input)` awaits the full load — this query's `load` plus every transitively read
 *   dependency — before resolving with the validated result.
 * - `.subscribe(input, callback)` invokes `callback` synchronously with the current {@link QueryState}
 *   and again whenever tracked state or the load lifecycle changes (deduped on the whole state).
 *   Subscribing is what fires the query's reactive `load`.
 *
 * There is intentionally no bare-call form: a previous `query(input)` that returned synchronously
 * *and* fired the `load` behind the scenes was removed because the implicit background load was
 * confusing. Read with `.get(input)`, await with `.loaded(input)`, observe with `.subscribe(...)`.
 *
 * Queries whose input schema resolves to `undefined` (for example `v.void()`) may be called with
 * zero arguments: `query.get()`, `query.loaded()`.
 */
type InputQuery<TInput, TOutput> = {
  get(input: TInput): TOutput;
  loaded(input: TInput): Promise<TOutput>;
  subscribe(input: TInput, callback: (state: QueryState<TOutput>) => void): () => void;
  subscribe<TSelected>(input: TInput, selector: (value: TOutput) => TSelected, callback: (state: QueryState<TSelected>) => void): () => void;
};
/** Zero-argument overloads merged into {@link Query} when the input schema is void. */
type VoidQuery<TOutput> = {
  get(): TOutput;
  loaded(): Promise<TOutput>;
  subscribe(callback: (state: QueryState<TOutput>) => void): () => void;
  subscribe<TSelected>(selector: (value: TOutput) => TSelected, callback: (state: QueryState<TSelected>) => void): () => void;
};
type Query<TInput, TOutput> = undefined extends TInput ? VoidQuery<TOutput> & InputQuery<TInput, TOutput> : InputQuery<TInput, TOutput>;
/**
 * Runtime query map derived directly from the inferred query schema maps.
 *
 * The query counterpart to {@link CommandFunctions}: it preserves each sibling query's exact
 * input/output types on the read-only `self.queries` handle, so a handler or `load` can call
 * `self.queries.someQuery.get(input)` without manual casts. `defineService` computes this map from
 * the inferred query schema maps and threads it into the handler/load contexts as their `TQueries`;
 * the erased {@link AnyQueryFunctions} bound is used everywhere the concrete map is not known.
 */
type QueryFunctions<TQueryInputSchemas extends OperationInputSchemas, TQueryOutputSchemas extends MatchingOutputSchemas<TQueryInputSchemas>> = { [TKey in keyof TQueryInputSchemas]: Query<InferSchemaInput<TQueryInputSchemas[TKey]>, InferSchemaOutput<TQueryOutputSchemas[TKey]>> };
/**
 * Permissive bound for a `self.queries` handle.
 *
 * Every {@link Query} — input or void — structurally satisfies {@link InputQuery} (the void
 * overloads are additive), so this is the supertype that any concrete {@link QueryFunctions} map is
 * assignable to. It is the bound (and erased default) for the `TQueries` parameter below, which lets
 * the precise per-service map flow into handler contexts while still erasing cleanly into the
 * structural `AnyQueryDefinition` storage constraint. Using `Query<unknown, unknown>` here instead
 * would wrongly demand the void zero-arg overloads from input queries.
 */
type AnyQueryFunctions = Record<string, InputQuery<unknown, unknown>>;
/**
 * Read-only service handle exposed to query handlers.
 *
 * Query handlers are strict readers: they can read state and call sibling queries, but they cannot
 * mutate state and cannot invoke commands. Mutations belong in commands; load-side preparation
 * belongs in `load`.
 */
type QuerySelf<TState = unknown, TQueries extends AnyQueryFunctions = AnyQueryFunctions> = {
  readonly state: TState;
  queries: TQueries;
};
/**
 * Load handle exposed to `load` functions.
 *
 * `load` may read state and queries, and may invoke declared commands to mutate state. It does
 * not receive `setState` directly — all writes must flow through commands so authors keep one
 * documented mutation surface per service.
 */
type LoadSelf<TState = unknown, TCommandInputSchemas extends OperationInputSchemas = OperationInputSchemas, TCommandOutputSchemas extends MatchingOutputSchemas<TCommandInputSchemas> = MatchingOutputSchemas<TCommandInputSchemas>, TQueries extends AnyQueryFunctions = AnyQueryFunctions> = QuerySelf<TState, TQueries> & {
  commands: CommandFunctions<TCommandInputSchemas, TCommandOutputSchemas>;
};
/**
 * Mutable service handle exposed to command handlers.
 *
 * Commands receive both `setState` for direct state mutation and `commands` so one command can
 * delegate to another within the same service.
 */
type CommandSelf<TState = unknown, TCommandInputSchemas extends OperationInputSchemas = OperationInputSchemas, TCommandOutputSchemas extends MatchingOutputSchemas<TCommandInputSchemas> = MatchingOutputSchemas<TCommandInputSchemas>, TQueries extends AnyQueryFunctions = AnyQueryFunctions> = LoadSelf<TState, TCommandInputSchemas, TCommandOutputSchemas, TQueries> & {
  setState(mutate: (state: TState) => void): void;
};
type ServiceSummary = {
  id: ServiceId;
  description?: string;
  queryNames: string[];
  commandNames: string[];
};
type OperationDescriptor = {
  name: string;
  description?: string;
  input: SchemaDescriptor;
  output: SchemaDescriptor; /** Present when the query declares `staticPath` at definition time. */
  staticPath?: true;
};
type ServiceDescriptor = {
  id: ServiceId;
  description?: string;
  queries: Record<string, OperationDescriptor>;
  commands: Record<string, OperationDescriptor>;
};
/** Context passed to query handlers. */
type QueryCtx<TState, TQueries extends AnyQueryFunctions = AnyQueryFunctions> = {
  self: QuerySelf<TState, TQueries>;
  getService: ServiceRegistryApi['getService'];
};
/** Context passed to `load` functions and static-input enumerators. */
type LoadCtx<TState, TCommandInputSchemas extends OperationInputSchemas = OperationInputSchemas, TCommandOutputSchemas extends MatchingOutputSchemas<TCommandInputSchemas> = MatchingOutputSchemas<TCommandInputSchemas>, TQueries extends AnyQueryFunctions = AnyQueryFunctions> = {
  self: LoadSelf<TState, TCommandInputSchemas, TCommandOutputSchemas, TQueries>;
  getService: ServiceRegistryApi['getService'];
};
/** Static input enumerator stored on registered definitions; always receives load context. */
type RegisteredStaticInputs<TState> = BivariantCallback<[ctx: LoadCtx<TState>], unknown[] | Promise<unknown[]>>;
/** Context passed to command handlers. */
type CommandCtx<TState, TCommandInputSchemas extends OperationInputSchemas = OperationInputSchemas, TCommandOutputSchemas extends MatchingOutputSchemas<TCommandInputSchemas> = MatchingOutputSchemas<TCommandInputSchemas>, TQueries extends AnyQueryFunctions = AnyQueryFunctions> = {
  self: CommandSelf<TState, TCommandInputSchemas, TCommandOutputSchemas, TQueries>;
  getService: ServiceRegistryApi['getService'];
};
/**
 * Declarative definition for one query.
 *
 * Queries validate caller input synchronously, run a synchronous read-only handler, and validate
 * the resolved output. The optional `load` hook is fired by subscriptions (reactively) and by
 * `.loaded()` callers (drained to completion), deduped per `(service, query, input)` while one is
 * already in flight — a bare `.get()` read never fires it.
 *
 * Queries that participate in static JSON generation declare `staticPath` at definition time.
 * `staticInputs` may also be declared here when the input list has no runtime dependencies; inputs
 * that need registry or story-index context belong in server registration instead.
 */
type QueryDefinition<TState, TInputSchema extends AnySchema$1, TOutputSchema extends AnySchema$1, TCommandInputSchemas extends OperationInputSchemas = OperationInputSchemas, TCommandOutputSchemas extends MatchingOutputSchemas<TCommandInputSchemas> = MatchingOutputSchemas<TCommandInputSchemas>, TQueries extends AnyQueryFunctions = AnyQueryFunctions> = {
  description?: string;
  /**
   * When true, hides this query from `describeService()` output. Defaults to false. Does not disable
   * the query at runtime — callers with a service handle can still invoke it.
   */
  internal?: boolean;
  input: TInputSchema;
  output: TOutputSchema; /** Logical path for the serialized state snapshot, relative to this service's output folder. */
  staticPath?: BivariantCallback<[input: InferSchemaOutput<TInputSchema>], string>; /** Dependency-free static build inputs declared alongside the public contract. */
  staticInputs?: BivariantCallback<[], InferSchemaInput<TInputSchema>[] | Promise<InferSchemaInput<TInputSchema>[]>>;
  handler?: BivariantCallback<[input: InferSchemaOutput<TInputSchema>, ctx: QueryCtx<TState, TQueries>], InferSchemaInput<TOutputSchema>>;
  load?: BivariantCallback<[input: InferSchemaOutput<TInputSchema>, ctx: LoadCtx<TState, TCommandInputSchemas, TCommandOutputSchemas, TQueries>], void | Promise<void>>;
};
/**
 * Declarative definition for one command.
 *
 * Commands validate caller input, run against a mutable context, and validate the resolved output.
 */
type CommandDefinition<TState, TInputSchema extends AnySchema$1, TOutputSchema extends AnySchema$1, TCommandInputSchemas extends OperationInputSchemas = OperationInputSchemas, TCommandOutputSchemas extends MatchingOutputSchemas<TCommandInputSchemas> = MatchingOutputSchemas<TCommandInputSchemas>, TQueries extends AnyQueryFunctions = AnyQueryFunctions> = {
  description?: string;
  /**
   * When true, hides this command from `describeService()` output. Defaults to false. Does not
   * disable the command at runtime — callers with a service handle can still invoke it.
   */
  internal?: boolean;
  input: TInputSchema;
  output: TOutputSchema;
  handler?: BivariantCallback<[input: InferSchemaOutput<TInputSchema>, ctx: CommandCtx<TState, TCommandInputSchemas, TCommandOutputSchemas, TQueries>], InferSchemaInput<TOutputSchema> | Promise<InferSchemaInput<TOutputSchema>>>;
};
/** Internal structural constraint used to store any query definition in a record. */
type AnyQueryDefinition<TState> = {
  description?: string;
  internal?: boolean;
  input: AnySchema$1;
  output: AnySchema$1;
  staticPath?: BivariantCallback<[input: unknown], string>;
  staticInputs?: RegisteredStaticInputs<TState>;
  handler?: BivariantCallback<[input: unknown, ctx: QueryCtx<TState>], unknown>;
  load?: BivariantCallback<[input: unknown, ctx: LoadCtx<TState>], void | Promise<void>>;
};
/** Internal structural constraint used to store any command definition in a record. */
type AnyCommandDefinition<TState> = {
  description?: string;
  internal?: boolean;
  input: AnySchema$1;
  output: AnySchema$1;
  handler?: BivariantCallback<[input: unknown, ctx: CommandCtx<TState>], unknown | Promise<unknown>>;
};
/** Named query map attached to a service definition. */
type Queries<TState> = Record<string, AnyQueryDefinition<TState>>;
/** Named command map attached to a service definition. */
type Commands<TState> = Record<string, AnyCommandDefinition<TState>>;
/** Top-level description of a service: identity, initial state, queries, and commands. */
type ServiceDefinition<TState, TQueries extends Queries<TState>, TCommands extends Commands<TState>, TId extends ServiceId = ServiceId> = {
  id: TId;
  description?: string;
  /**
   * When true, hides this service from `listServices()` output and requires
   * `getService(id, { internal: true })` to resolve it. Defaults to false.
   * Internal services are unstable: Storybook may break their ids, state, and operations without
   * a public semver bump. Prefer public toolsets (`defineToolset`) for MCP/CLI surfaces.
   */
  internal?: boolean;
  /**
   * Initial state for the service. Must be a plain object (not a primitive, `null`, or array) — see
   * {@link ServiceState} for why. The authoring boundary (`defineService`) enforces this; the runtime
   * type stays `TState` so already-constructed definitions flow through the registry unchanged.
   */
  initialState: TState;
  queries: TQueries;
  commands: TCommands;
};
/** Structural constraint for any service definition stored in the registry. */
type AnyServiceDefinition = ServiceDefinition<unknown, Queries<unknown>, Commands<unknown>>;
/** Runtime service instance derived from a `ServiceDefinition`. */
type ServiceInstance<TState, TQueries extends Queries<TState>, TCommands extends Commands<TState>> = {
  queries: { [TKey in keyof TQueries]: TQueries[TKey] extends {
    input: infer TInputSchema extends AnySchema$1;
    output: infer TOutputSchema extends AnySchema$1;
  } ? Query<InferSchemaInput<TInputSchema>, InferSchemaOutput<TOutputSchema>> : never };
  commands: { [TKey in keyof TCommands]: TCommands[TKey] extends {
    input: infer TInputSchema extends AnySchema$1;
    output: infer TOutputSchema extends AnySchema$1;
  } ? (input: InferSchemaInput<TInputSchema>) => Promise<InferSchemaOutput<TOutputSchema>> : never };
};
/** Runtime instance type recovered from one authored service definition. */
type ServiceInstanceOf<TDefinition extends AnyServiceDefinition> = TDefinition extends ServiceDefinition<infer TState, infer TQueries, infer TCommands> ? ServiceInstance<TState, TQueries, TCommands> : never;
type GetServiceOptions = {
  /**
   * Required when the target service is marked `internal: true`. Internal OSA surfaces are unstable
   * and may change without a semver bump — only pass this when you intentionally accept that risk.
   */
  internal?: boolean;
};
interface ServiceRegistryApi {
  listServices(): Promise<ServiceSummary[]>;
  describeService(serviceId: ServiceId): Promise<ServiceDescriptor>;
  getService<TInstance = RuntimeService>(serviceId: ServiceId, options?: GetServiceOptions): TInstance;
}
type RuntimeService = ServiceInstance<unknown, Queries<unknown>, Commands<unknown>> & ServiceRegistryApi;
type ServiceQueryRegistration<TState> = {
  /** Static build inputs that may depend on registry or other server context. */staticInputs?: RegisteredStaticInputs<TState>;
};
type ServiceCommandRegistration<TState, TCommand extends AnyCommandDefinition<TState>> = Pick<TCommand, 'handler'>;
type ServiceRegistrationOptions<TState, TQueries extends Queries<TState>, TCommands extends Commands<TState>> = {
  queries?: { [TKey in keyof TQueries]?: ServiceQueryRegistration<TState> };
  commands?: { [TKey in keyof TCommands]?: ServiceCommandRegistration<TState, TCommands[TKey]> };
};
type ServerServiceRegistration<TState, TQueries extends Queries<TState>, TCommands extends Commands<TState>> = {
  definition: ServiceDefinition<TState, TQueries, TCommands>;
} & ServiceRegistrationOptions<TState, TQueries, TCommands>;
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
type AnyToolsetDefinition = ToolsetDefinition;
/**
 * What a handler may return when its method publishes an `output`: outcomes whose `data` —
 * on both branches, since adapters validate failure data into `structuredContent` too — carries at
 * least the schema's declared shape. The open record keeps the data-superset pattern legal: the
 * rendered Markdown may use fields the public contract does not ship. Intersecting with
 * `Record<string, unknown>` keeps handler `data` an object.
 */
type SchemaBoundData<TSchema extends AnySchema> = StandardSchemaV1.InferInput<TSchema> & Record<string, unknown>;
type MethodOutcomeContract<TMethod> = TMethod extends {
  output: infer TOut extends AnySchema;
} ? ToolsetOutcome<SchemaBoundData<TOut>> | Promise<ToolsetOutcome<SchemaBoundData<TOut>>> : unknown;
/**
 * Second contextual-typing pass for the methods literal: `handler` input comes from that method's
 * own `input`, and its outcome data from the method's `output` where one is declared — so
 * renaming or removing a published field is a compile error at the definition site. Intersecting
 * this with the inferred map is what makes the flow work on both the stable and the native
 * TypeScript compiler — inferring a separate record does not.
 */
type MethodContracts<TMethods extends ToolsetMethods> = { [TKey in keyof TMethods]: {
  handler: (input: StandardSchemaV1.InferOutput<TMethods[TKey]['input']>, context: ToolsetCtx) => MethodOutcomeContract<TMethods[TKey]>;
} };
declare function defineToolset<const TId extends string, const TMethods extends ToolsetMethods>(definition: {
  id: TId;
  description: string;
  methods: TMethods & MethodContracts<TMethods>;
}): ToolsetDefinition<TId, TMethods>;
/** Resolves a method description for one transport. */
declare function resolveToolsetDescription(description: ToolsetMethodDescription, context: ToolsetCtx): string;
/**
 * A handler's report completed from where the method is registered: the CLI spelling of the
 * invoked names (`stories`, `find-by-component`) and the generated event name
 * (`tool:stories_findByComponent`).
 */
type ToolsetMethodReport = ToolsetTelemetryReport & {
  toolset: string;
  tool: string;
  event: string;
};
type InvokedToolsetOutcome = ToolsetOutcome<any, any, ToolsetMethodReport>;
/**
 * Runs one method the way every surface does. The report is named after the registration, never
 * by the handler, so a method cannot report a toolset that disagrees with where it lives. Every
 * surface forwards the report as is and adds only its own fields.
 */
declare function invokeToolsetMethod(toolset: AnyToolsetDefinition, methodName: string, input: unknown, context: ToolsetCtx): Promise<InvokedToolsetOutcome>;
//#endregion
export { Queries as A, ServerServiceRegistration as B, GetServiceOptions as C, MatchingOutputSchemas as D, LoadStatus as E, QuerySelf as F, ServiceInstanceOf as G, ServiceDescriptor as H, QueryState as I, ServiceState as J, ServiceRegistrationOptions as K, QueryStatus as L, QueryCtx as M, QueryDefinition as N, OperationDescriptor as O, QueryFunctions as P, RuntimeService as R, Commands as S, LoadSelf as T, ServiceId as U, ServiceDefinition as V, ServiceInstance as W, StaticStore as X, ServiceSummary as Y, StandardSchemaV1 as Z, AnyServiceDefinition as _, ToolsetDefinition as a, CommandDefinition as b, ToolsetMethodDescription as c, ToolsetOutcome as d, ToolsetTelemetryReport as f, resolveToolsetDescription as g, invokeToolsetMethod as h, ToolsetCtx as i, Query as j, OperationInputSchemas as k, ToolsetMethodReport as l, defineToolset as m, AnyToolsetOutcome as n, ToolsetGetService as o, ToolsetTransport as p, ServiceRegistryApi as q, InvokedToolsetOutcome as r, ToolsetMethod as s, AnyToolsetDefinition as t, ToolsetObjectOutputSchema as u, Command as v, LoadCtx as w, CommandSelf as x, CommandCtx as y, SchemaDescriptor as z };