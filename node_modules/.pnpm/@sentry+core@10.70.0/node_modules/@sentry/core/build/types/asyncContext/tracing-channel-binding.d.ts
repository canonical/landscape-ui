import type { Scope } from '../scope';
import type { TracingChannelBinding } from './types';
/**
 * Execute a callback whenever the tracing channel binding is available.
 * If it is not available after retry, the callback is not executed.
 */
export declare function waitForTracingChannelBinding(callback: () => void, retries?: number): void;
/**
 * Build the default {@link TracingChannelBinding} shared by AsyncLocalStorage-based strategies.
 *
 * The ALS instance is supplied by the caller (kept as `unknown`).
 * The binding clones the current scope, plants the span on it, and reuses the existing isolation scope.
 *
 * The OpenTelemetry strategy does not use this: its store value is an OTel context, not a
 * `{ scope, isolationScope }` pair.
 */
export declare function _INTERNAL_createTracingChannelBinding(asyncLocalStorage: NonNullable<unknown>, getScopes: () => {
    scope: Scope;
    isolationScope: Scope;
}): TracingChannelBinding;
//# sourceMappingURL=tracing-channel-binding.d.ts.map