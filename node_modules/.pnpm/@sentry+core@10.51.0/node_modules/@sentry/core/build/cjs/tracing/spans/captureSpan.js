Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const semanticAttributes = require('../../semanticAttributes.js');
const scopeData = require('../../utils/scopeData.js');
const spanUtils = require('../../utils/spanUtils.js');
const utils = require('../utils.js');
const beforeSendSpan = require('./beforeSendSpan.js');

/**
 * Captures a span and returns a JSON representation to be enqueued for sending.
 *
 * IMPORTANT: This function converts the span to JSON immediately to avoid writing
 * to an already-ended OTel span instance (which is blocked by the OTel Span class).
 *
 * @returns the final serialized span with a reference to its segment span. This reference
 * is needed later on to compute the DSC for the span envelope.
 */
function captureSpan(span, client) {
  // Convert to JSON FIRST - we cannot write to an already-ended span
  const spanJSON = spanUtils.spanToStreamedSpanJSON(span);

  const segmentSpan = spanUtils.INTERNAL_getSegmentSpan(span);
  const serializedSegmentSpan = spanUtils.spanToStreamedSpanJSON(segmentSpan);

  const { isolationScope: spanIsolationScope, scope: spanScope } = utils.getCapturedScopesOnSpan(span);

  const finalScopeData = scopeData.getCombinedScopeData(spanIsolationScope, spanScope);

  applyCommonSpanAttributes(spanJSON, serializedSegmentSpan, client, finalScopeData);

  // Backfill span data from OTel semantic conventions when not explicitly set.
  // OTel-originated spans don't have sentry.op, description, etc. — the non-streamed path
  // infers these in the SentrySpanExporter, but streamed spans skip the exporter entirely.
  // Access `kind` via duck-typing — OTel span objects have this property but it's not on Sentry's Span type.
  // This must run before all hooks and beforeSendSpan so that user callbacks can see and override inferred values.
  const spanKind = (span ).kind;
  inferSpanDataFromOtelAttributes(spanJSON, spanKind);

  if (spanJSON.is_segment) {
    // Allow hook subscribers to mutate the segment span JSON
    // This also invokes the `processSegmentSpan` hook of all integrations
    client.emit('processSegmentSpan', spanJSON);
  }

  // This allows hook subscribers to mutate the span JSON
  // This also invokes the `processSpan` hook of all integrations
  client.emit('processSpan', spanJSON);

  const { beforeSendSpan: beforeSendSpan$1 } = client.getOptions();
  const processedSpan =
    beforeSendSpan$1 && beforeSendSpan.isStreamedBeforeSendSpanCallback(beforeSendSpan$1)
      ? applyBeforeSendSpanCallback(spanJSON, beforeSendSpan$1)
      : spanJSON;

  // Backfill sentry.span.source from sentry.source. Only `sentry.span.source` is respected by Sentry.
  // TODO(v11): Remove this backfill once we renamed SEMANTIC_ATTRIBUTE_SENTRY_SOURCE to sentry.span.source
  const spanNameSource = processedSpan.attributes?.[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE];
  if (spanNameSource) {
    safeSetSpanJSONAttributes(processedSpan, {
      // Purposefully not using a constant defined here like in other attributes:
      // This will be the name for SEMANTIC_ATTRIBUTE_SENTRY_SOURCE in v11
      'sentry.span.source': spanNameSource,
    });
  }

  return {
    ...spanUtils.streamedSpanJsonToSerializedSpan(processedSpan),
    _segmentSpan: segmentSpan,
  };
}

function applyCommonSpanAttributes(
  spanJSON,
  serializedSegmentSpan,
  client,
  scopeData,
) {
  const sdk = client.getSdkMetadata();
  const { release, environment, sendDefaultPii } = client.getOptions();

  // avoid overwriting any previously set attributes (from users or potentially our SDK instrumentation)
  safeSetSpanJSONAttributes(spanJSON, {
    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_RELEASE]: release,
    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ENVIRONMENT]: environment,
    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SEGMENT_NAME]: serializedSegmentSpan.name,
    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SEGMENT_ID]: serializedSegmentSpan.span_id,
    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SDK_NAME]: sdk?.sdk?.name,
    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SDK_VERSION]: sdk?.sdk?.version,
    ...(sendDefaultPii
      ? {
          [semanticAttributes.SEMANTIC_ATTRIBUTE_USER_ID]: scopeData.user?.id,
          [semanticAttributes.SEMANTIC_ATTRIBUTE_USER_EMAIL]: scopeData.user?.email,
          [semanticAttributes.SEMANTIC_ATTRIBUTE_USER_IP_ADDRESS]: scopeData.user?.ip_address,
          [semanticAttributes.SEMANTIC_ATTRIBUTE_USER_USERNAME]: scopeData.user?.username,
        }
      : {}),
    ...scopeData.attributes,
  });
}

/**
 * Apply a user-provided beforeSendSpan callback to a span JSON.
 */
function applyBeforeSendSpanCallback(
  span,
  beforeSendSpan,
) {
  const modifedSpan = beforeSendSpan(span);
  if (!modifedSpan) {
    spanUtils.showSpanDropWarning();
    return span;
  }
  return modifedSpan;
}

/**
 * Safely set attributes on a span JSON.
 * If an attribute already exists, it will not be overwritten.
 */
function safeSetSpanJSONAttributes(
  spanJSON,
  newAttributes,
) {
  const originalAttributes = spanJSON.attributes ?? (spanJSON.attributes = {});

  Object.entries(newAttributes).forEach(([key, value]) => {
    if (value != null && !(key in originalAttributes)) {
      originalAttributes[key] = value;
    }
  });
}

// OTel SpanKind values (numeric to avoid importing from @opentelemetry/api)
const SPAN_KIND_SERVER = 1;
const SPAN_KIND_CLIENT = 2;

/**
 * Infer and backfill span data from OTel semantic conventions.
 * This mirrors what the `SentrySpanExporter` does for non-streamed spans via `getSpanData`/`inferSpanData`.
 * Streamed spans skip the exporter, so we do the inference here during capture.
 *
 * Backfills: `sentry.op`, `sentry.source`, and `name` (description).
 * Uses `safeSetSpanJSONAttributes` so explicitly set attributes are never overwritten.
 */
/** Exported only for tests. */
function inferSpanDataFromOtelAttributes(spanJSON, spanKind) {
  const attributes = spanJSON.attributes;
  if (!attributes) {
    return;
  }

  const httpMethod = attributes['http.request.method'] || attributes['http.method'];
  if (httpMethod) {
    inferHttpSpanData(spanJSON, attributes, spanKind, httpMethod);
    return;
  }

  const dbSystem = attributes['db.system.name'] || attributes['db.system'];
  const opIsCache =
    typeof attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP] === 'string' &&
    `${attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]}`.startsWith('cache.');
  if (dbSystem && !opIsCache) {
    inferDbSpanData(spanJSON, attributes);
    return;
  }

  if (attributes['rpc.service']) {
    safeSetSpanJSONAttributes(spanJSON, { [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'rpc' });
    return;
  }

  if (attributes['messaging.system']) {
    safeSetSpanJSONAttributes(spanJSON, { [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'message' });
    return;
  }

  const faasTrigger = attributes['faas.trigger'];
  if (faasTrigger) {
    safeSetSpanJSONAttributes(spanJSON, { [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: `${faasTrigger}` });
  }
}

function inferHttpSpanData(
  spanJSON,
  attributes,
  spanKind,
  httpMethod,
) {
  // Infer op: http.client, http.server, or just http
  const opParts = ['http'];
  if (spanKind === SPAN_KIND_CLIENT) {
    opParts.push('client');
  } else if (spanKind === SPAN_KIND_SERVER) {
    opParts.push('server');
  }
  if (attributes['sentry.http.prefetch']) {
    opParts.push('prefetch');
  }
  safeSetSpanJSONAttributes(spanJSON, { [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: opParts.join('.') });

  // If the user set a custom span name via updateSpanName(), apply it — OTel instrumentation
  // may have overwritten span.name after the user set it, so we restore from the attribute.
  const customName = attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME];
  if (typeof customName === 'string') {
    spanJSON.name = customName;
    return;
  }

  if (attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] === 'custom') {
    return;
  }

  // Only overwrite the span name when we have an explicit http.route — it's more specific than
  // what OTel instrumentation sets as the span name. For all other cases (url.full, http.target),
  // the OTel-set name is already good enough and we'd risk producing a worse name (e.g. full URL).
  const httpRoute = attributes['http.route'];
  if (typeof httpRoute === 'string') {
    spanJSON.name = `${httpMethod} ${httpRoute}`;
    safeSetSpanJSONAttributes(spanJSON, { [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'route' });
  } else {
    // Fallback: set source to 'url' for HTTP spans without a route.
    // The spec requires sentry.span.source on segment spans, and the non-streamed exporter
    // always sets this — so we need to ensure it's present for streamed spans too.
    safeSetSpanJSONAttributes(spanJSON, { [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'url' });
  }
}

function inferDbSpanData(spanJSON, attributes) {
  safeSetSpanJSONAttributes(spanJSON, { [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'db' });

  // If the user set a custom span name via updateSpanName(), apply it.
  const customName = attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME];
  if (typeof customName === 'string') {
    spanJSON.name = customName;
    return;
  }

  if (attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] === 'custom') {
    return;
  }

  const statement = attributes['db.statement'];
  if (statement) {
    spanJSON.name = `${statement}`;
    safeSetSpanJSONAttributes(spanJSON, { [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'task' });
  }
}

exports.applyBeforeSendSpanCallback = applyBeforeSendSpanCallback;
exports.captureSpan = captureSpan;
exports.inferSpanDataFromOtelAttributes = inferSpanDataFromOtelAttributes;
exports.safeSetSpanJSONAttributes = safeSetSpanJSONAttributes;
//# sourceMappingURL=captureSpan.js.map
