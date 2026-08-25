Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const spanstatus = require('../../tracing/spanstatus.js');
const attributes = require('./attributes.js');
const resultExtraction = require('./resultExtraction.js');
const sessionExtraction = require('./sessionExtraction.js');
const sessionManagement = require('./sessionManagement.js');

const sessionToSpanMap = /* @__PURE__ */ new Map();
const statelessSpanMap = /* @__PURE__ */ new WeakMap();
function getOrCreateSpanMap(transport) {
  const sessionId = transport.sessionId;
  if (sessionId) {
    let spanMap2 = sessionToSpanMap.get(sessionId);
    if (!spanMap2) {
      spanMap2 = /* @__PURE__ */ new Map();
      sessionToSpanMap.set(sessionId, spanMap2);
    }
    return spanMap2;
  }
  let spanMap = statelessSpanMap.get(transport);
  if (!spanMap) {
    spanMap = /* @__PURE__ */ new Map();
    statelessSpanMap.set(transport, spanMap);
  }
  return spanMap;
}
function storeSpanForRequest(transport, requestId, span, method) {
  const spanMap = getOrCreateSpanMap(transport);
  spanMap.set(requestId, {
    span,
    method,
    // oxlint-disable-next-line sdk/no-unsafe-random-apis
    startTime: Date.now()
  });
}
function completeSpanWithResults(transport, requestId, result, options, hasError = false) {
  const spanMap = getOrCreateSpanMap(transport);
  const spanData = spanMap.get(requestId);
  if (spanData) {
    const { span, method } = spanData;
    const responseSessionData = method === "initialize" ? sessionExtraction.extractSessionDataFromInitializeResponse(result) : sessionExtraction.extractSessionDataFromResponse(result);
    if (responseSessionData.protocolVersion || responseSessionData.serverInfo) {
      sessionManagement.updateSessionDataForTransport(transport, responseSessionData);
    }
    const responseAttributes = {
      ...sessionExtraction.buildServerAttributesFromInfo(responseSessionData.serverInfo)
    };
    if (responseSessionData.protocolVersion) {
      responseAttributes[attributes.MCP_PROTOCOL_VERSION_ATTRIBUTE] = responseSessionData.protocolVersion;
    }
    if (Object.keys(responseAttributes).length > 0) {
      span.setAttributes(responseAttributes);
    }
    if (hasError) {
      span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" });
    } else if (method === "tools/call") {
      const toolAttributes = resultExtraction.extractToolResultAttributes(result, options.recordOutputs);
      span.setAttributes(toolAttributes);
    } else if (method === "prompts/get") {
      const promptAttributes = resultExtraction.extractPromptResultAttributes(result, options.recordOutputs);
      span.setAttributes(promptAttributes);
    }
    span.end();
    spanMap.delete(requestId);
  }
}
function cleanupPendingSpansForTransport(transport) {
  const sessionId = transport.sessionId;
  if (sessionId) {
    const spanMap2 = sessionToSpanMap.get(sessionId);
    if (spanMap2) {
      for (const [, spanData] of spanMap2) {
        spanData.span.setStatus({
          code: spanstatus.SPAN_STATUS_ERROR,
          message: "cancelled"
        });
        spanData.span.end();
      }
      sessionToSpanMap.delete(sessionId);
    }
    return;
  }
  const spanMap = statelessSpanMap.get(transport);
  if (spanMap) {
    for (const [, spanData] of spanMap) {
      spanData.span.setStatus({
        code: spanstatus.SPAN_STATUS_ERROR,
        message: "cancelled"
      });
      spanData.span.end();
    }
    spanMap.clear();
  }
}

exports.cleanupPendingSpansForTransport = cleanupPendingSpansForTransport;
exports.completeSpanWithResults = completeSpanWithResults;
exports.storeSpanForRequest = storeSpanForRequest;
//# sourceMappingURL=correlation.js.map
