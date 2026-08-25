import type { Client } from '../client';
/**
 * @private Private API with no semver guarantees!
 *
 * Enable deferred segment-span transaction capture for a client: create its debounced queue and
 * register the strategy (idempotent).
 *
 * `SentrySpan` otherwise assembles the transaction synchronously the instant a segment span ends, which
 * drops children whose async instrumentation closes them later (a diagnostics-channel `asyncEnd`
 * callback in the same tick, or engine spans replayed on a later tick). The debounced snapshot delays
 * capture just enough for those later span ends to land first; a child that still ends after it is
 * emitted as its own orphan transaction. Pending captures drain on the client's `flush` hook, so
 * `Sentry.flush()` / `client.close()` cannot resolve before they run.
 */
export declare function _INTERNAL_setDeferSegmentSpanCapture(client: Client): void;
//# sourceMappingURL=deferSegmentSpanCapture.d.ts.map