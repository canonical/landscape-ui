Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const attributes = require('@sentry/conventions/attributes');
const semanticAttributes = require('../../semanticAttributes.js');
const genAiAttributes = require('../ai/gen-ai-attributes.js');
const utils = require('../ai/utils.js');
const string = require('../../utils/string.js');
const constants = require('./constants.js');

function getOperationName(inputs) {
  if (inputs && typeof inputs === "object") {
    if ("messages" in inputs || "prompt" in inputs) {
      return "chat";
    }
    if ("text" in inputs) {
      return "embeddings";
    }
  }
  return "chat";
}
function extractRequestAttributes(model, inputs, operationName) {
  const attributes$1 = {
    [attributes.GEN_AI_PROVIDER_NAME]: constants.WORKERS_AI_PROVIDER_NAME,
    [attributes.GEN_AI_OPERATION_NAME]: operationName,
    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: constants.WORKERS_AI_ORIGIN,
    [attributes.GEN_AI_REQUEST_MODEL]: typeof model === "string" ? model : "unknown"
  };
  if (inputs && typeof inputs === "object") {
    const params = inputs;
    if (typeof params.temperature === "number") {
      attributes$1[attributes.GEN_AI_REQUEST_TEMPERATURE] = params.temperature;
    }
    if (typeof params.max_tokens === "number") {
      attributes$1[attributes.GEN_AI_REQUEST_MAX_TOKENS] = params.max_tokens;
    }
    if (typeof params.top_p === "number") {
      attributes$1[attributes.GEN_AI_REQUEST_TOP_P] = params.top_p;
    }
    if (typeof params.top_k === "number") {
      attributes$1[attributes.GEN_AI_REQUEST_TOP_K] = params.top_k;
    }
    if (typeof params.frequency_penalty === "number") {
      attributes$1[attributes.GEN_AI_REQUEST_FREQUENCY_PENALTY] = params.frequency_penalty;
    }
    if (typeof params.presence_penalty === "number") {
      attributes$1[attributes.GEN_AI_REQUEST_PRESENCE_PENALTY] = params.presence_penalty;
    }
    if (params.stream === true) {
      attributes$1[genAiAttributes.GEN_AI_REQUEST_STREAM_ATTRIBUTE] = true;
    }
  }
  return attributes$1;
}
function addRequestAttributes(span, inputs, operationName, enableTruncation) {
  if (!inputs || typeof inputs !== "object") {
    return;
  }
  const params = inputs;
  if (operationName === "embeddings") {
    const text = params.text;
    if (text == null || typeof text === "string" && text.length === 0 || Array.isArray(text) && text.length === 0) {
      return;
    }
    span.setAttribute(attributes.GEN_AI_EMBEDDINGS_INPUT, typeof text === "string" ? text : JSON.stringify(text));
    return;
  }
  const src = params.messages ?? params.prompt;
  if (src == null || Array.isArray(src) && src.length === 0) {
    return;
  }
  const { systemInstructions, filteredMessages } = utils.extractSystemInstructions(src);
  if (systemInstructions) {
    span.setAttribute(attributes.GEN_AI_SYSTEM_INSTRUCTIONS, systemInstructions);
  }
  span.setAttribute(
    attributes.GEN_AI_INPUT_MESSAGES,
    enableTruncation ? utils.getTruncatedJsonString(filteredMessages) : string.stringify(filteredMessages)
  );
  span.setAttribute(
    genAiAttributes.GEN_AI_INPUT_MESSAGES_ORIGINAL_LENGTH_ATTRIBUTE,
    Array.isArray(filteredMessages) ? filteredMessages.length : 1
  );
}
function setOutputMessagesAttribute(span, { responseText, toolCalls }) {
  const parts = [];
  if (typeof responseText === "string" && responseText.length > 0) {
    parts.push({ type: "text", content: responseText });
  }
  if (Array.isArray(toolCalls)) {
    for (const toolCall of toolCalls) {
      if (!toolCall || typeof toolCall !== "object") {
        continue;
      }
      const call = toolCall;
      const name = call.function?.name ?? call.name;
      const args = call.function?.arguments ?? call.arguments;
      parts.push({
        type: "tool_call",
        id: call.id,
        name,
        arguments: typeof args === "string" ? args : JSON.stringify(args ?? {})
      });
    }
  }
  if (parts.length > 0) {
    span.setAttribute(genAiAttributes.GEN_AI_OUTPUT_MESSAGES_ATTRIBUTE, JSON.stringify([{ role: "assistant", parts }]));
  }
}
function addResponseAttributes(span, result, recordOutputs) {
  if (!result || typeof result !== "object" || // Raw `Response` objects (from `returnRawResponse`/`websocket`) cannot be introspected without consuming them.
  typeof Response !== "undefined" && result instanceof Response) {
    return;
  }
  const response = result;
  if (response.usage) {
    utils.setTokenUsageAttributes(span, response.usage.prompt_tokens, response.usage.completion_tokens);
  }
  if (recordOutputs) {
    let responseText;
    if (typeof response.response === "string") {
      responseText = response.response;
      span.setAttribute(genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE, response.response);
    } else if (response.response != null) {
      responseText = JSON.stringify(response.response);
      span.setAttribute(genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE, responseText);
    }
    const toolCalls = Array.isArray(response.tool_calls) && response.tool_calls.length > 0 ? response.tool_calls : void 0;
    if (toolCalls) {
      span.setAttribute(genAiAttributes.GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE, JSON.stringify(toolCalls));
    }
    setOutputMessagesAttribute(span, { responseText, toolCalls });
  }
}

exports.addRequestAttributes = addRequestAttributes;
exports.addResponseAttributes = addResponseAttributes;
exports.extractRequestAttributes = extractRequestAttributes;
exports.getOperationName = getOperationName;
exports.setOutputMessagesAttribute = setOutputMessagesAttribute;
//# sourceMappingURL=utils.js.map
