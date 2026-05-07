import { addNonEnumerableProperty } from '../utils/object.js';
import { derefWeakRef, makeWeakRef } from '../utils/weakRef.js';

const SCOPE_ON_START_SPAN_FIELD = '_sentryScope';
const ISOLATION_SCOPE_ON_START_SPAN_FIELD = '_sentryIsolationScope';

/** Store the scope & isolation scope for a span, which can the be used when it is finished. */
function setCapturedScopesOnSpan(span, scope, isolationScope) {
  if (span) {
    addNonEnumerableProperty(span, ISOLATION_SCOPE_ON_START_SPAN_FIELD, makeWeakRef(isolationScope));
    // We don't wrap the scope with a WeakRef here because webkit aggressively garbage collects
    // and scopes are not held in memory for long periods of time.
    addNonEnumerableProperty(span, SCOPE_ON_START_SPAN_FIELD, scope);
  }
}

/**
 * Grabs the scope and isolation scope off a span that were active when the span was started.
 * If WeakRef was used and scopes have been garbage collected, returns undefined for those scopes.
 */
function getCapturedScopesOnSpan(span) {
  const spanWithScopes = span ;

  return {
    scope: spanWithScopes[SCOPE_ON_START_SPAN_FIELD],
    isolationScope: derefWeakRef(spanWithScopes[ISOLATION_SCOPE_ON_START_SPAN_FIELD]),
  };
}

export { getCapturedScopesOnSpan, setCapturedScopesOnSpan };
//# sourceMappingURL=utils.js.map
