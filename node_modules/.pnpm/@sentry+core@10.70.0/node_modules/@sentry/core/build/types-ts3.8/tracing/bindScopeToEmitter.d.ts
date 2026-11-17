import { Scope } from '../scope';
/**
 * Binds a scope to the given event emitter, so that any listener added to it runs with that scope
 * (and therefore the active span) active — even if the listener fires later, in a different async
 * context.
 *
 * By default the currently active scope is bound, captured at the time this function is called.
 * Pass an explicit `scope` to bind a different one.
 *
 * This is useful when instrumenting APIs that hand back an event emitter (e.g. a streamed database
 * query) whose `'data'` / `'error'` / `'end'` listeners would otherwise lose the trace context.
 *
 * Works with both Node.js `EventEmitter`s (`on`, `addListener`, ...) and DOM `EventTarget`s
 * (`addEventListener`). Objects exposing none of these methods are returned untouched.
 *
 * The isolation scope is intentionally not captured — it is carried along by the active async
 * context. This mirrors the event-emitter behavior of OpenTelemetry's `ContextManager.bind`.
 */
export declare function bindScopeToEmitter<T extends object>(emitter: T, scope?: Scope): T;
//# sourceMappingURL=bindScopeToEmitter.d.ts.map
