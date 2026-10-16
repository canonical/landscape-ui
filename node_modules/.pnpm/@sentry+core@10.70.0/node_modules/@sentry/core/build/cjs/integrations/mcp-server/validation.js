Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const debugBuild = require('../../debug-build.js');
const debugLogger = require('../../utils/debug-logger.js');
const is = require('../../utils/is.js');

function isJsonRpcRequest(message) {
  return is.isObjectLike(message) && "jsonrpc" in message && message.jsonrpc === "2.0" && "method" in message && "id" in message;
}
function isJsonRpcNotification(message) {
  return is.isObjectLike(message) && "jsonrpc" in message && message.jsonrpc === "2.0" && "method" in message && !("id" in message);
}
function isJsonRpcResponse(message) {
  return is.isObjectLike(message) && "jsonrpc" in message && message.jsonrpc === "2.0" && "id" in message && ("result" in message || "error" in message);
}
function validateMcpServerInstance(instance) {
  if (is.isObjectLike(instance) && "connect" in instance && ("tool" in instance && "resource" in instance && "prompt" in instance || "registerTool" in instance && "registerResource" in instance && "registerPrompt" in instance)) {
    return true;
  }
  debugBuild.DEBUG_BUILD && debugLogger.debug.warn("Did not patch MCP server. Interface is incompatible.");
  return false;
}
function isValidContentItem(item) {
  return is.isObjectLike(item);
}

exports.isJsonRpcNotification = isJsonRpcNotification;
exports.isJsonRpcRequest = isJsonRpcRequest;
exports.isJsonRpcResponse = isJsonRpcResponse;
exports.isValidContentItem = isValidContentItem;
exports.validateMcpServerInstance = validateMcpServerInstance;
//# sourceMappingURL=validation.js.map
