import type { Span, SpanAttributeValue } from '../../types/span';
import type { GoogleGenAIOptions, GoogleGenAIResponse } from './types';
/**
 * Extract model from parameters or chat context object
 * For chat instances, the model is available on the chat object as 'model' (older versions) or 'modelVersion' (newer versions)
 */
export declare function extractModel(params: Record<string, unknown>, context?: unknown): string;
/**
 * Extract request attributes from method arguments
 * Builds the base attributes for span creation including system info, model, and config
 */
export declare function extractRequestAttributes(operationName: string, params?: Record<string, unknown>, context?: unknown): Record<string, SpanAttributeValue>;
/**
 * Add private request attributes to spans.
 * This is only recorded if recordInputs is true.
 * Handles different parameter formats for different Google GenAI methods.
 */
export declare function addPrivateRequestAttributes(span: Span, params: Record<string, unknown>, operationName: string, enableTruncation: boolean): void;
/**
 * Add response attributes from the Google GenAI response
 * @see https://github.com/googleapis/js-genai/blob/v1.19.0/src/types.ts#L2313
 */
export declare function addResponseAttributes(span: Span, response: GoogleGenAIResponse, recordOutputs?: boolean): void;
/**
 * Instrument a Google GenAI client with Sentry tracing
 * Can be used across Node.js, Cloudflare Workers, and Vercel Edge
 *
 * @template T - The type of the client that extends client object
 * @param client - The Google GenAI client to instrument
 * @param options - Optional configuration for recording inputs and outputs
 * @returns The instrumented client with the same type as the input
 *
 * @example
 * ```typescript
 * import { GoogleGenAI } from '@google/genai';
 * import { instrumentGoogleGenAIClient } from '@sentry/core';
 *
 * const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
 * const instrumentedClient = instrumentGoogleGenAIClient(genAI);
 *
 * // Now both chats.create and sendMessage will be instrumented
 * const chat = instrumentedClient.chats.create({ model: 'gemini-1.5-pro' });
 * const response = await chat.sendMessage({ message: 'Hello' });
 * ```
 */
export declare function instrumentGoogleGenAIClient<T extends object>(client: T, options?: GoogleGenAIOptions): T;
//# sourceMappingURL=index.d.ts.map