import { addNonEnumerableProperty } from '../utils/object.js';
import { derefWeakRef, makeWeakRef } from '../utils/weakRef.js';

const SCOPE_ON_START_SPAN_FIELD = "_sentryScope";
const ISOLATION_SCOPE_ON_START_SPAN_FIELD = "_sentryIsolationScope";
const OTEL_SOURCE_INFERENCE_SPAN_FIELD = /* @__PURE__ */ Symbol.for("sentry.otelSourceInference");
const OTEL_SOURCE_EXPLICITLY_SET_SPAN_FIELD = /* @__PURE__ */ Symbol.for("sentry.otelSourceExplicitlySet");
const TRACER_PROVIDER_SPAN_FIELD = /* @__PURE__ */ Symbol.for("sentry.tracerProviderSpan");
function setCapturedScopesOnSpan(span, scope, isolationScope) {
  if (span) {
    addNonEnumerableProperty(span, ISOLATION_SCOPE_ON_START_SPAN_FIELD, makeWeakRef(isolationScope));
    addNonEnumerableProperty(span, SCOPE_ON_START_SPAN_FIELD, scope);
  }
}
function getCapturedScopesOnSpan(span) {
  const spanWithScopes = span;
  return {
    scope: spanWithScopes[SCOPE_ON_START_SPAN_FIELD],
    isolationScope: derefWeakRef(spanWithScopes[ISOLATION_SCOPE_ON_START_SPAN_FIELD])
  };
}
function markSpanForOtelSourceInference(span) {
  addNonEnumerableProperty(span, OTEL_SOURCE_INFERENCE_SPAN_FIELD, true);
}
function spanShouldInferOtelSource(span) {
  return span[OTEL_SOURCE_INFERENCE_SPAN_FIELD] === true;
}
function markSpanSourceAsExplicit(span) {
  addNonEnumerableProperty(span, OTEL_SOURCE_EXPLICITLY_SET_SPAN_FIELD, true);
}
function spanSourceWasExplicitlySet(span) {
  return span[OTEL_SOURCE_EXPLICITLY_SET_SPAN_FIELD] === true;
}
function markSpanAsTracerProviderSpan(span) {
  addNonEnumerableProperty(span, TRACER_PROVIDER_SPAN_FIELD, true);
}
function spanIsTracerProviderSpan(span) {
  return span[TRACER_PROVIDER_SPAN_FIELD] === true;
}

export { getCapturedScopesOnSpan, markSpanAsTracerProviderSpan, markSpanForOtelSourceInference, markSpanSourceAsExplicit, setCapturedScopesOnSpan, spanIsTracerProviderSpan, spanShouldInferOtelSource, spanSourceWasExplicitlySet };
//# sourceMappingURL=utils.js.map
