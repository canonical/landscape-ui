import { Span } from '../../types/span';
import { AnthropicAiOptions, AnthropicAiResponse } from './types';
/**
 * Extract request attributes from method arguments
 */
export declare function extractRequestAttributes(args: unknown[], methodPath: string, operationName: string): Record<string, unknown>;
/**
 * Add private request attributes to spans.
 * This is only recorded if recordInputs is true.
 */
export declare function addPrivateRequestAttributes(span: Span, params: Record<string, unknown>, enableTruncation: boolean): void;
/**
 * Add response attributes to spans
 */
export declare function addResponseAttributes(span: Span, response: AnthropicAiResponse, recordOutputs?: boolean): void;
/**
 * Instrument an Anthropic AI client with Sentry tracing
 * Can be used across Node.js, Cloudflare Workers, and Vercel Edge
 *
 * @template T - The type of the client that extends object
 * @param client - The Anthropic AI client to instrument
 * @param options - Optional configuration for recording inputs and outputs
 * @returns The instrumented client with the same type as the input
 */
export declare function instrumentAnthropicAiClient<T extends object>(anthropicAiClient: T, options?: AnthropicAiOptions): T;
//# sourceMappingURL=index.d.ts.map
