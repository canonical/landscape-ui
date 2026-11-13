import { Span } from '../../types/span';
export interface AIRecordingOptions {
    recordInputs?: boolean;
    recordOutputs?: boolean;
}
/**
 * A method registry entry describes a single instrumented method:
 * which gen_ai operation it maps to and whether it is intrinsically streaming.
 */
export interface InstrumentedMethodEntry {
    /** Operation name (e.g. 'chat', 'embeddings', 'generate_content'). Omit for factory methods that only need result proxying. */
    operation?: string;
    /** True if the method itself is always streaming (not param-based) */
    streaming?: boolean;
    /** When set, the method's return value is re-proxied with this as the base path */
    proxyResultPath?: string;
}
/**
 * Maps method paths to their registry entries.
 * Used by proxy-based AI client instrumentations to determine which methods
 * to instrument, what operation name to use, and whether they stream.
 */
export type InstrumentedMethodRegistry = Record<string, InstrumentedMethodEntry>;
/**
 * Resolves AI recording options by falling back to the client's `dataCollection.genAI` settings.
 * Precedence: explicit option > dataCollection.genAI > sendDefaultPii > false
 */
export declare function resolveAIRecordingOptions<T extends AIRecordingOptions>(options?: T): T & Required<AIRecordingOptions>;
/**
 * Resolves whether truncation should be enabled.
 * If the user explicitly set `enableTruncation`, that value is used.
 * Otherwise, truncation is disabled whenever gen_ai spans are sent through the span streaming / v2
 * span path, i.e. full span streaming (`traceLifecycle: 'stream'`) or `streamGenAiSpans`. That path
 * is not subject to the transaction payload-size limits that truncation works around, so the full
 * message data can be retained. `streamGenAiSpans` is opt-out (on unless explicitly set to `false`).
 */
export declare function shouldEnableTruncation(enableTruncation: boolean | undefined): boolean;
/**
 * Build method path from current traversal
 */
export declare function buildMethodPath(currentPath: string, prop: string): string;
/**
 * Set token usage attributes
 * @param span - The span to add attributes to
 * @param promptTokens - The number of prompt tokens
 * @param completionTokens - The number of completion tokens
 * @param cachedInputTokens - The number of cached input tokens
 * @param cachedOutputTokens - The number of cached output tokens
 */
export declare function setTokenUsageAttributes(span: Span, promptTokens?: number, completionTokens?: number, cachedInputTokens?: number, cachedOutputTokens?: number): void;
export interface StreamResponseState {
    responseId?: string;
    responseModel?: string;
    finishReasons: string[];
    responseTexts: string[];
    toolCalls: unknown[];
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    cacheCreationInputTokens?: number;
    cacheReadInputTokens?: number;
}
/**
 * Ends a streaming span by setting all accumulated response attributes and ending the span.
 * Shared across OpenAI, Anthropic, and Google GenAI streaming implementations.
 */
export declare function endStreamSpan(span: Span, state: StreamResponseState, recordOutputs: boolean): void;
/**
 * Get the truncated JSON string for a string, an array of messages, or an object.
 *
 * @param value - The value to truncate and serialize
 * @returns The truncated JSON string
 */
export declare function getTruncatedJsonString<T>(value: T | T[]): string;
/**
 * Extract system instructions from messages array.
 * Finds the first system message and formats it according to OpenTelemetry semantic conventions.
 *
 * @param messages - Array of messages to extract system instructions from
 * @returns systemInstructions (JSON string) and filteredMessages (without system message)
 */
export declare function extractSystemInstructions(messages: unknown[] | unknown): {
    systemInstructions: string | undefined;
    filteredMessages: unknown[] | unknown;
};
/**
 * Wraps a promise-like object to preserve additional methods (like .withResponse())
 * that AI SDK clients (OpenAI, Anthropic) attach to their APIPromise return values.
 *
 * Standard Promise methods (.then, .catch, .finally) are routed to the instrumented
 * promise to preserve Sentry's span instrumentation, while custom SDK methods are
 * forwarded to the original promise to maintain the SDK's API surface.
 */
export declare function wrapPromiseWithMethods<R>(originalPromiseLike: Promise<R>, instrumentedPromise: Promise<R>, mechanismType: string): Promise<R>;
//# sourceMappingURL=utils.d.ts.map
