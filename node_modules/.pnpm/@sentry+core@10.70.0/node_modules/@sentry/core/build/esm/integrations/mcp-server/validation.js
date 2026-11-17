import { DEBUG_BUILD } from '../../debug-build.js';
import { debug } from '../../utils/debug-logger.js';
import { isObjectLike } from '../../utils/is.js';

function isJsonRpcRequest(message) {
  return isObjectLike(message) && "jsonrpc" in message && message.jsonrpc === "2.0" && "method" in message && "id" in message;
}
function isJsonRpcNotification(message) {
  return isObjectLike(message) && "jsonrpc" in message && message.jsonrpc === "2.0" && "method" in message && !("id" in message);
}
function isJsonRpcResponse(message) {
  return isObjectLike(message) && "jsonrpc" in message && message.jsonrpc === "2.0" && "id" in message && ("result" in message || "error" in message);
}
function validateMcpServerInstance(instance) {
  if (isObjectLike(instance) && "connect" in instance && ("tool" in instance && "resource" in instance && "prompt" in instance || "registerTool" in instance && "registerResource" in instance && "registerPrompt" in instance)) {
    return true;
  }
  DEBUG_BUILD && debug.warn("Did not patch MCP server. Interface is incompatible.");
  return false;
}
function isValidContentItem(item) {
  return isObjectLike(item);
}

export { isJsonRpcNotification, isJsonRpcRequest, isJsonRpcResponse, isValidContentItem, validateMcpServerInstance };
//# sourceMappingURL=validation.js.map
