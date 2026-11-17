import type { Span, SpanAttributeValue } from '../../types/span';
/**
 * Determine the gen_ai operation name from the inputs passed to `AI.run`.
 * Workers AI exposes a single `run` method, so we infer the operation from the input shape.
 */
export declare function getOperationName(inputs: unknown): string;
/**
 * Extract the request attributes (model, request parameters, system, origin) from a `run` call.
 */
export declare function extractRequestAttributes(model: unknown, inputs: unknown, operationName: string): Record<string, SpanAttributeValue>;
/**
 * Record the request inputs (messages/prompt/embeddings input) on the span.
 * Only called when `recordInputs` is enabled.
 */
export declare function addRequestAttributes(span: Span, inputs: unknown, operationName: string, enableTruncation: boolean): void;
/**
 * Build the `gen_ai.output.messages` value (a single assistant message with text and/or
 * tool-call parts) from the response text and tool calls.
 *
 * We set this in addition to the deprecated `gen_ai.response.text` / `gen_ai.response.tool_calls`
 * attributes because Sentry's product reads the model output from `gen_ai.output.messages` first.
 * Relay migrates `gen_ai.response.text` into `gen_ai.output.messages`, but the tool-calls half of
 * that migration is lossy — so tool-call turns would otherwise render an empty Output. Emitting the
 * normalized message here (mirroring the Vercel AI integration) keeps tool calls visible.
 */
export declare function setOutputMessagesAttribute(span: Span, { responseText, toolCalls }: {
    responseText?: string;
    toolCalls?: unknown[];
}): void;
/**
 * Record the response attributes (token usage, response text, tool calls) on the span.
 */
export declare function addResponseAttributes(span: Span, result: unknown, recordOutputs: boolean): void;
//# sourceMappingURL=utils.d.ts.map