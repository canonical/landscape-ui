import type { SpanAttributeValue } from '../../types/span';
import type { LangChainOptions } from './types';
/**
 * Builds the span options for a LangChain embedding call from the embeddings instance and input.
 *
 * @internal Exported so the diagnostics-channel (orchestrion) instrumentation can build the same
 * span as the prototype-patching path below.
 */
export declare function _INTERNAL_getLangChainEmbeddingsSpanOptions(instance: unknown, input: unknown, options?: LangChainOptions): {
    name: string;
    op: string;
    attributes: Record<string, SpanAttributeValue>;
};
/**
 * Wraps a LangChain embedding method (embedQuery or embedDocuments) to create Sentry spans.
 *
 * Used internally by the Node.js auto-instrumentation to patch embedding class prototypes.
 */
export declare function instrumentEmbeddingMethod(originalMethod: (...args: unknown[]) => Promise<unknown>, options?: LangChainOptions): (...args: unknown[]) => Promise<unknown>;
/**
 * Wraps a LangChain embeddings instance to create Sentry spans for `embedQuery` and `embedDocuments` calls.
 *
 * Use this in non-Node runtimes (Cloudflare, browser, etc.) where auto-instrumentation is not available.
 *
 * @example
 * ```javascript
 * import * as Sentry from '@sentry/cloudflare';
 * import { OpenAIEmbeddings } from '@langchain/openai';
 *
 * const embeddings = Sentry.instrumentLangChainEmbeddings(
 *   new OpenAIEmbeddings({ model: 'text-embedding-3-small' })
 * );
 *
 * await embeddings.embedQuery('Hello world');
 * await embeddings.embedDocuments(['doc1', 'doc2']);
 * ```
 */
export declare function instrumentLangChainEmbeddings<T extends object>(instance: T, options?: LangChainOptions): T;
//# sourceMappingURL=embeddings.d.ts.map