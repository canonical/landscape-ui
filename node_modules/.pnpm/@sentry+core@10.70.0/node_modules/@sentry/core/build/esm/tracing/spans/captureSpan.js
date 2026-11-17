import { SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, SEMANTIC_ATTRIBUTE_USER_USERNAME, SEMANTIC_ATTRIBUTE_USER_IP_ADDRESS, SEMANTIC_ATTRIBUTE_USER_EMAIL, SEMANTIC_ATTRIBUTE_USER_ID, SEMANTIC_ATTRIBUTE_SENTRY_ENVIRONMENT, SEMANTIC_ATTRIBUTE_SENTRY_RELEASE, SEMANTIC_ATTRIBUTE_SENTRY_SDK_INTEGRATIONS } from '../../semanticAttributes.js';
import { getCombinedScopeData } from '../../utils/scopeData.js';
import { spanToStreamedSpanJSON, INTERNAL_getSegmentSpan, streamedSpanJsonToSerializedSpan, showSpanDropWarning } from '../../utils/spanUtils.js';
import { getCapturedScopesOnSpan } from '../utils.js';
import { isStreamedBeforeSendSpanCallback } from './beforeSendSpan.js';
import { scopeContextsToSpanAttributes } from './scopeContextAttributes.js';
import { DEFAULT_ENVIRONMENT } from '../../constants.js';
import { SENTRY_SDK_VERSION, SENTRY_SDK_NAME, SENTRY_SEGMENT_ID, SENTRY_SEGMENT_NAME, SENTRY_TRACE_LIFECYCLE } from '@sentry/conventions/attributes';

function captureSpan(span, client) {
  const spanJSON = spanToStreamedSpanJSON(span);
  const segmentSpan = INTERNAL_getSegmentSpan(span);
  const serializedSegmentSpan = spanToStreamedSpanJSON(segmentSpan);
  const { isolationScope: spanIsolationScope, scope: spanScope } = getCapturedScopesOnSpan(span);
  const finalScopeData = getCombinedScopeData(spanIsolationScope, spanScope);
  applyCommonSpanAttributes(spanJSON, serializedSegmentSpan, client, finalScopeData);
  const spanKind = span.kind;
  client.emit("preprocessSpan", spanJSON, { spanKind });
  if (spanJSON.is_segment) {
    applyScopeToSegmentSpan(spanJSON, finalScopeData);
    applySdkMetadataToSegmentSpan(spanJSON, client);
    client.emit("processSegmentSpan", spanJSON);
  }
  client.emit("processSpan", spanJSON);
  const { beforeSendSpan } = client.getOptions();
  const processedSpan = beforeSendSpan && isStreamedBeforeSendSpanCallback(beforeSendSpan) ? applyBeforeSendSpanCallback(spanJSON, beforeSendSpan) : spanJSON;
  const spanNameSource = processedSpan.attributes?.[SEMANTIC_ATTRIBUTE_SENTRY_SOURCE];
  if (spanJSON.is_segment && spanNameSource) {
    safeSetSpanJSONAttributes(processedSpan, {
      ["sentry.segment.name.source"]: spanNameSource
    });
  }
  return {
    ...streamedSpanJsonToSerializedSpan(processedSpan),
    _segmentSpan: segmentSpan
  };
}
function applyScopeToSegmentSpan(segmentSpanJSON, scopeData) {
  const contextAttributes = scopeContextsToSpanAttributes(scopeData.contexts);
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
    [SEMANTIC_ATTRIBUTE_SENTRY_SDK_INTEGRATIONS]: integrationNames
  });
}
function applyCommonSpanAttributes(spanJSON, serializedSegmentSpan, client, scopeData) {
  const sdk = client.getSdkMetadata();
  const { release, environment } = client.getOptions();
  safeSetSpanJSONAttributes(spanJSON, {
    [SENTRY_TRACE_LIFECYCLE]: "stream",
    [SENTRY_SEGMENT_NAME]: serializedSegmentSpan.name,
    [SENTRY_SEGMENT_ID]: serializedSegmentSpan.span_id,
    [SENTRY_SDK_NAME]: sdk?.sdk?.name,
    [SENTRY_SDK_VERSION]: sdk?.sdk?.version,
    [SEMANTIC_ATTRIBUTE_SENTRY_RELEASE]: release,
    [SEMANTIC_ATTRIBUTE_SENTRY_ENVIRONMENT]: environment || DEFAULT_ENVIRONMENT,
    [SEMANTIC_ATTRIBUTE_USER_ID]: scopeData.user?.id,
    [SEMANTIC_ATTRIBUTE_USER_EMAIL]: scopeData.user?.email,
    [SEMANTIC_ATTRIBUTE_USER_IP_ADDRESS]: scopeData.user?.ip_address,
    [SEMANTIC_ATTRIBUTE_USER_USERNAME]: scopeData.user?.username,
    ...scopeData.attributes
  });
}
function applyBeforeSendSpanCallback(span, beforeSendSpan) {
  const modifedSpan = beforeSendSpan(span);
  if (!modifedSpan) {
    showSpanDropWarning();
    return span;
  }
  return modifedSpan;
}

export { applyBeforeSendSpanCallback, captureSpan, safeSetSpanJSONAttributes };
//# sourceMappingURL=captureSpan.js.map
