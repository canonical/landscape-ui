import type { WorkersAiOptions } from './types';
/**
 * Instrument a Cloudflare Workers AI binding (`env.AI`) with Sentry tracing.
 *
 * This wraps the binding's `run` method to create `gen_ai` spans following the
 * Sentry AI Agents conventions. All other methods are passed through untouched.
 *
 * In `@sentry/cloudflare`, the `env.AI` binding is instrumented automatically —
 * wrapping manually is only needed to pass custom options.
 *
 * @example
 * ```javascript
 * const ai = Sentry.instrumentWorkersAiClient(env.AI, { recordInputs: true, recordOutputs: true });
 * const result = await ai.run('@cf/meta/llama-3.1-8b-instruct', { prompt: 'Hello' });
 * ```
 */
export declare function instrumentWorkersAiClient<T extends object>(client: T, options?: WorkersAiOptions): T;
//# sourceMappingURL=index.d.ts.map