Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const semanticAttributes = require('../../semanticAttributes.js');
const scopeData = require('../../utils/scopeData.js');
const spanUtils = require('../../utils/spanUtils.js');
const utils = require('../utils.js');
const beforeSendSpan = require('./beforeSendSpan.js');
const scopeContextAttributes = require('./scopeContextAttributes.js');
const constants = require('../../constants.js');
const attributes = require('@sentry/conventions/attributes');

function captureSpan(span, client) {
  const spanJSON = spanUtils.spanToStreamedSpanJSON(span);
  const segmentSpan = spanUtils.INTERNAL_getSegmentSpan(span);
  const serializedSegmentSpan = spanUtils.spanToStreamedSpanJSON(segmentSpan);
  const { isolationScope: spanIsolationScope, scope: spanScope } = utils.getCapturedScopesOnSpan(span);
  const finalScopeData = scopeData.getCombinedScopeData(spanIsolationScope, spanScope);
  applyCommonSpanAttributes(spanJSON, serializedSegmentSpan, client, finalScopeData);
  const spanKind = span.kind;
  client.emit("preprocessSpan", spanJSON, { spanKind });
  if (spanJSON.is_segment) {
    applyScopeToSegmentSpan(spanJSON, finalScopeData);
    applySdkMetadataToSegmentSpan(spanJSON, client);
    client.emit("processSegmentSpan", spanJSON);
  }
  client.emit("processSpan", spanJSON);
  const { beforeSendSpan: beforeSendSpan$1 } = client.getOptions();
  const processedSpan = beforeSendSpan$1 && beforeSendSpan.isStreamedBeforeSendSpanCallback(beforeSendSpan$1) ? applyBeforeSendSpanCallback(spanJSON, beforeSendSpan$1) : spanJSON;
  const spanNameSource = processedSpan.attributes?.[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE];
  if (spanJSON.is_segment && spanNameSource) {
    safeSetSpanJSONAttributes(processedSpan, {
      ["sentry.segment.name.source"]: spanNameSource
    });
  }
  return {
    ...spanUtils.streamedSpanJsonToSerializedSpan(processedSpan),
    _segmentSpan: segmentSpan
  };
}
function applyScopeToSegmentSpan(segmentSpanJSON, scopeData) {
  const contextAttributes = scopeContextAttributes.scopeContextsToSpanAttributes(scopeData.contexts);
  safeSetSpanJSONAttributes(segmentSpanJSON, contextAttributes);
}
function safeSetSpanJSONAttributes(spanJSON, newAttributes) {
  const originalAttributes = spanJSON.attributes ?? (spanJSON.attributes = {});
  Object.entries(newAttributes).forEach(([key, value]) => {
    if (value != null && !(key in originalAttributes)) {
      originalAttributes[key] = value;
    }
  });
}
function applySdkMetadataToSegmentSpan(segmentSpanJSON, client) {
  const integrationNames = client.getIntegrationNames();
  if (!integrationNames.length) return;
  safeSetSpanJSONAttributes(segmentSpanJSON, {
    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SDK_INTEGRATIONS]: integrationNames
  });
}
function applyCommonSpanAttributes(spanJSON, serializedSegmentSpan, client, scopeData) {
  const sdk = client.getSdkMetadata();
  const { release, environment } = client.getOptions();
  safeSetSpanJSONAttributes(spanJSON, {
    [attributes.SENTRY_TRACE_LIFECYCLE]: "stream",
    [attributes.SENTRY_SEGMENT_NAME]: serializedSegmentSpan.name,
    [attributes.SENTRY_SEGMENT_ID]: serializedSegmentSpan.span_id,
    [attributes.SENTRY_SDK_NAME]: sdk?.sdk?.name,
    [attributes.SENTRY_SDK_VERSION]: sdk?.sdk?.version,
    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_RELEASE]: release,
    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ENVIRONMENT]: environment || constants.DEFAULT_ENVIRONMENT,
    [semanticAttributes.SEMANTIC_ATTRIBUTE_USER_ID]: scopeData.user?.id,
    [semanticAttributes.SEMANTIC_ATTRIBUTE_USER_EMAIL]: scopeData.user?.email,
    [semanticAttributes.SEMANTIC_ATTRIBUTE_USER_IP_ADDRESS]: scopeData.user?.ip_address,
    [semanticAttributes.SEMANTIC_ATTRIBUTE_USER_USERNAME]: scopeData.user?.username,
    ...scopeData.attributes
  });
}
function applyBeforeSendSpanCallback(span, beforeSendSpan) {
  const modifedSpan = beforeSendSpan(span);
  if (!modifedSpan) {
    spanUtils.showSpanDropWarning();
    return span;
  }
  return modifedSpan;
}

exports.applyBeforeSendSpanCallback = applyBeforeSendSpanCallback;
exports.captureSpan = captureSpan;
exports.safeSetSpanJSONAttributes = safeSetSpanJSONAttributes;
//# sourceMappingURL=captureSpan.js.map
