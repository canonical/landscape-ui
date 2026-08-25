import { getIsolationScope, withIsolationScope } from '../../currentScopes.js';
import { fill } from '../../utils/object.js';
import { isObjectLike } from '../../utils/is.js';
import { startInactiveSpan, withActiveSpan } from '../../tracing/trace.js';
import { MCP_PROTOCOL_VERSION_ATTRIBUTE } from './attributes.js';
import { storeSpanForRequest, completeSpanWithResults, cleanupPendingSpansForTransport } from './correlation.js';
import { captureError } from './errorCapture.js';
import { extractSessionDataFromInitializeRequest, extractSessionDataFromMessage, buildClientAttributesFromInfo } from './sessionExtraction.js';
import { updateSessionDataForTransport, cleanupSessionDataForTransport } from './sessionManagement.js';
import { buildMcpServerSpanConfig, createMcpNotificationSpan, createMcpOutgoingNotificationSpan } from './spans.js';
import { isJsonRpcRequest, isJsonRpcNotification, isJsonRpcResponse } from './validation.js';

function wrapTransportOnMessage(transport, options) {
  if (transport.onmessage) {
    fill(transport, "onmessage", (originalOnMessage) => {
      return function(message, extra) {
        const request = isJsonRpcRequest(message) ? message : void 0;
        const notification = isJsonRpcNotification(message) ? message : void 0;
        const jsonRpcMessage = request || notification;
        let messageSessionData;
        if (jsonRpcMessage) {
          try {
            messageSessionData = request?.method === "initialize" ? extractSessionDataFromInitializeRequest(request) : extractSessionDataFromMessage(jsonRpcMessage);
            if (messageSessionData.protocolVersion || messageSessionData.clientInfo) {
              updateSessionDataForTransport(transport, messageSessionData);
            }
          } catch {
          }
        }
        if (request) {
          const isolationScope = getIsolationScope().clone();
          return withIsolationScope(isolationScope, () => {
            const spanConfig = buildMcpServerSpanConfig(request, transport, extra, options);
            const span = startInactiveSpan(spanConfig);
            if (request.method === "initialize" && messageSessionData) {
              span.setAttributes({
                ...buildClientAttributesFromInfo(messageSessionData.clientInfo),
                ...messageSessionData.protocolVersion && {
                  [MCP_PROTOCOL_VERSION_ATTRIBUTE]: messageSessionData.protocolVersion
                }
              });
            }
            storeSpanForRequest(transport, request.id, span, request.method);
            return withActiveSpan(span, () => {
              return originalOnMessage.call(this, request, extra);
            });
          });
        }
        if (notification) {
          return createMcpNotificationSpan(notification, transport, extra, options, () => {
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
    fill(transport, "send", (originalSend) => {
      return async function(...args) {
        const [message] = args;
        if (isJsonRpcNotification(message)) {
          return createMcpOutgoingNotificationSpan(message, transport, options, () => {
            return originalSend.call(this, ...args);
          });
        }
        if (isJsonRpcResponse(message)) {
          if (message.id !== null && message.id !== void 0) {
            if (message.error) {
              captureJsonRpcErrorResponse(message.error);
            }
            completeSpanWithResults(transport, message.id, message.result, options, !!message.error);
          }
        }
        return originalSend.call(this, ...args);
      };
    });
  }
}
function wrapTransportOnClose(transport) {
  if (transport.onclose) {
    fill(transport, "onclose", (originalOnClose) => {
      return function(...args) {
        cleanupPendingSpansForTransport(transport);
        cleanupSessionDataForTransport(transport);
        return originalOnClose.call(this, ...args);
      };
    });
  }
}
function wrapTransportError(transport) {
  if (transport.onerror) {
    fill(transport, "onerror", (originalOnError) => {
      return function(error) {
        captureTransportError(error);
        return originalOnError.call(this, error);
      };
    });
  }
}
function captureJsonRpcErrorResponse(errorResponse) {
  try {
    if (isObjectLike(errorResponse) && "code" in errorResponse && "message" in errorResponse) {
      const jsonRpcError = errorResponse;
      const isServerError = jsonRpcError.code === -32603 || jsonRpcError.code >= -32099 && jsonRpcError.code <= -32e3;
      if (isServerError) {
        const error = new Error(jsonRpcError.message);
        error.name = `JsonRpcError_${jsonRpcError.code}`;
        captureError(error, "protocol");
      }
    }
  } catch {
  }
}
function captureTransportError(error) {
  try {
    captureError(error, "transport");
  } catch {
  }
}

export { wrapTransportError, wrapTransportOnClose, wrapTransportOnMessage, wrapTransportSend };
//# sourceMappingURL=transport.js.map
