import type { Span } from '../../types/span';
import type { OpenAiOptions } from './types';
/**
 * Extract request attributes from method arguments
 */
export declare function extractRequestAttributes(args: unknown[], operationName: string): Record<string, unknown>;
export declare function addRequestAttributes(span: Span, params: Record<string, unknown>, operationName: string, enableTruncation: boolean): void;
/**
 * Instrument an OpenAI client with Sentry tracing
 * Can be used across Node.js, Cloudflare Workers, and Vercel Edge
 */
export declare function instrumentOpenAiClient<T extends object>(client: T, options?: OpenAiOptions): T;
//# sourceMappingURL=index.d.ts.map