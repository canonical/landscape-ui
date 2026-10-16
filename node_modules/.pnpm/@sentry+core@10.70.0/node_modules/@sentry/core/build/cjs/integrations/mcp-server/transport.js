Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const currentScopes = require('../../currentScopes.js');
const object = require('../../utils/object.js');
const is = require('../../utils/is.js');
const trace = require('../../tracing/trace.js');
const attributes = require('./attributes.js');
const correlation = require('./correlation.js');
const errorCapture = require('./errorCapture.js');
const sessionExtraction = require('./sessionExtraction.js');
const sessionManagement = require('./sessionManagement.js');
const spans = require('./spans.js');
const validation = require('./validation.js');

function wrapTransportOnMessage(transport, options) {
  if (transport.onmessage) {
    object.fill(transport, "onmessage", (originalOnMessage) => {
      return function(message, extra) {
        const request = validation.isJsonRpcRequest(message) ? message : void 0;
        const notification = validation.isJsonRpcNotification(message) ? message : void 0;
        const jsonRpcMessage = request || notification;
        let messageSessionData;
        if (jsonRpcMessage) {
          try {
            messageSessionData = request?.method === "initialize" ? sessionExtraction.extractSessionDataFromInitializeRequest(request) : sessionExtraction.extractSessionDataFromMessage(jsonRpcMessage);
            if (messageSessionData.protocolVersion || messageSessionData.clientInfo) {
              sessionManagement.updateSessionDataForTransport(transport, messageSessionData);
            }
          } catch {
          }
        }
        if (request) {
          const isolationScope = currentScopes.getIsolationScope().clone();
          return currentScopes.withIsolationScope(isolationScope, () => {
            const spanConfig = spans.buildMcpServerSpanConfig(request, transport, extra, options);
            const span = trace.startInactiveSpan(spanConfig);
            if (request.method === "initialize" && messageSessionData) {
              span.setAttributes({
                ...sessionExtraction.buildClientAttributesFromInfo(messageSessionData.clientInfo),
                ...messageSessionData.protocolVersion && {
                  [attributes.MCP_PROTOCOL_VERSION_ATTRIBUTE]: messageSessionData.protocolVersion
                }
              });
            }
            correlation.storeSpanForRequest(transport, request.id, span, request.method);
            return trace.withActiveSpan(span, () => {
              return originalOnMessage.call(this, request, extra);
            });
          });
        }
        if (notification) {
          return spans.createMcpNotificationSpan(notification, transport, extra, options, () => {
            return originalOnMessage.call(this, notification, extra);
          });
        }
        return originalOnMessage.call(this, message, extra);
      };
    });
  }
}
function wrapTransportSend(transport, options) {
  if (transport.send) {
    object.fill(transport, "send", (originalSend) => {
      return async function(...args) {
        const [message] = args;
        if (validation.isJsonRpcNotification(message)) {
          return spans.createMcpOutgoingNotificationSpan(message, transport, options, () => {
            return originalSend.call(this, ...args);
          });
        }
        if (validation.isJsonRpcResponse(message)) {
          if (message.id !== null && message.id !== void 0) {
            if (message.error) {
              captureJsonRpcErrorResponse(message.error);
            }
            correlation.completeSpanWithResults(transport, message.id, message.result, options, !!message.error);
          }
        }
        return originalSend.call(this, ...args);
      };
    });
  }
}
function wrapTransportOnClose(transport) {
  if (transport.onclose) {
    object.fill(transport, "onclose", (originalOnClose) => {
      return function(...args) {
        correlation.cleanupPendingSpansForTransport(transport);
        sessionManagement.cleanupSessionDataForTransport(transport);
        return originalOnClose.call(this, ...args);
      };
    });
  }
}
function wrapTransportError(transport) {
  if (transport.onerror) {
    object.fill(transport, "onerror", (originalOnError) => {
      return function(error) {
        captureTransportError(error);
        return originalOnError.call(this, error);
      };
    });
  }
}
function captureJsonRpcErrorResponse(errorResponse) {
  try {
    if (is.isObjectLike(errorResponse) && "code" in errorResponse && "message" in errorResponse) {
      const jsonRpcError = errorResponse;
      const isServerError = jsonRpcError.code === -32603 || jsonRpcError.code >= -32099 && jsonRpcError.code <= -32e3;
      if (isServerError) {
        const error = new Error(jsonRpcError.message);
        error.name = `JsonRpcError_${jsonRpcError.code}`;
        errorCapture.captureError(error, "protocol");
      }
    }
  } catch {
  }
}
function captureTransportError(error) {
  try {
    errorCapture.captureError(error, "transport");
  } catch {
  }
}

exports.wrapTransportError = wrapTransportError;
exports.wrapTransportOnClose = wrapTransportOnClose;
exports.wrapTransportOnMessage = wrapTransportOnMessage;
exports.wrapTransportSend = wrapTransportSend;
//# sourceMappingURL=transport.js.map
