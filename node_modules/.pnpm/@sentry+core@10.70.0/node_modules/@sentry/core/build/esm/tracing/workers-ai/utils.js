import { GEN_AI_REQUEST_TEMPERATURE, GEN_AI_REQUEST_MAX_TOKENS, GEN_AI_REQUEST_TOP_P, GEN_AI_REQUEST_TOP_K, GEN_AI_REQUEST_FREQUENCY_PENALTY, GEN_AI_REQUEST_PRESENCE_PENALTY, GEN_AI_EMBEDDINGS_INPUT, GEN_AI_SYSTEM_INSTRUCTIONS, GEN_AI_INPUT_MESSAGES, GEN_AI_REQUEST_MODEL, GEN_AI_OPERATION_NAME, GEN_AI_PROVIDER_NAME } from '@sentry/conventions/attributes';
import { SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN } from '../../semanticAttributes.js';
import { GEN_AI_REQUEST_STREAM_ATTRIBUTE, GEN_AI_INPUT_MESSAGES_ORIGINAL_LENGTH_ATTRIBUTE, GEN_AI_RESPONSE_TEXT_ATTRIBUTE, GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE, GEN_AI_OUTPUT_MESSAGES_ATTRIBUTE } from '../ai/gen-ai-attributes.js';
import { extractSystemInstructions, getTruncatedJsonString, setTokenUsageAttributes } from '../ai/utils.js';
import { stringify } from '../../utils/string.js';
import { WORKERS_AI_ORIGIN, WORKERS_AI_PROVIDER_NAME } from './constants.js';

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
  const attributes = {
    [GEN_AI_PROVIDER_NAME]: WORKERS_AI_PROVIDER_NAME,
    [GEN_AI_OPERATION_NAME]: operationName,
    [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: WORKERS_AI_ORIGIN,
    [GEN_AI_REQUEST_MODEL]: typeof model === "string" ? model : "unknown"
  };
  if (inputs && typeof inputs === "object") {
    const params = inputs;
    if (typeof params.temperature === "number") {
      attributes[GEN_AI_REQUEST_TEMPERATURE] = params.temperature;
    }
    if (typeof params.max_tokens === "number") {
      attributes[GEN_AI_REQUEST_MAX_TOKENS] = params.max_tokens;
    }
    if (typeof params.top_p === "number") {
      attributes[GEN_AI_REQUEST_TOP_P] = params.top_p;
    }
    if (typeof params.top_k === "number") {
      attributes[GEN_AI_REQUEST_TOP_K] = params.top_k;
    }
    if (typeof params.frequency_penalty === "number") {
      attributes[GEN_AI_REQUEST_FREQUENCY_PENALTY] = params.frequency_penalty;
    }
    if (typeof params.presence_penalty === "number") {
      attributes[GEN_AI_REQUEST_PRESENCE_PENALTY] = params.presence_penalty;
    }
    if (params.stream === true) {
      attributes[GEN_AI_REQUEST_STREAM_ATTRIBUTE] = true;
    }
  }
  return attributes;
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
    span.setAttribute(GEN_AI_EMBEDDINGS_INPUT, typeof text === "string" ? text : JSON.stringify(text));
    return;
  }
  const src = params.messages ?? params.prompt;
  if (src == null || Array.isArray(src) && src.length === 0) {
    return;
  }
  const { systemInstructions, filteredMessages } = extractSystemInstructions(src);
  if (systemInstructions) {
    span.setAttribute(GEN_AI_SYSTEM_INSTRUCTIONS, systemInstructions);
  }
  span.setAttribute(
    GEN_AI_INPUT_MESSAGES,
    enableTruncation ? getTruncatedJsonString(filteredMessages) : stringify(filteredMessages)
  );
  span.setAttribute(
    GEN_AI_INPUT_MESSAGES_ORIGINAL_LENGTH_ATTRIBUTE,
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
    span.setAttribute(GEN_AI_OUTPUT_MESSAGES_ATTRIBUTE, JSON.stringify([{ role: "assistant", parts }]));
  }
}
function addResponseAttributes(span, result, recordOutputs) {
  if (!result || typeof result !== "object" || // Raw `Response` objects (from `returnRawResponse`/`websocket`) cannot be introspected without consuming them.
  typeof Response !== "undefined" && result instanceof Response) {
    return;
  }
  const response = result;
  if (response.usage) {
    setTokenUsageAttributes(span, response.usage.prompt_tokens, response.usage.completion_tokens);
  }
  if (recordOutputs) {
    let responseText;
    if (typeof response.response === "string") {
      responseText = response.response;
      span.setAttribute(GEN_AI_RESPONSE_TEXT_ATTRIBUTE, response.response);
    } else if (response.response != null) {
      responseText = JSON.stringify(response.response);
      span.setAttribute(GEN_AI_RESPONSE_TEXT_ATTRIBUTE, responseText);
    }
    const toolCalls = Array.isArray(response.tool_calls) && response.tool_calls.length > 0 ? response.tool_calls : void 0;
    if (toolCalls) {
      span.setAttribute(GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE, JSON.stringify(toolCalls));
    }
    setOutputMessagesAttribute(span, { responseText, toolCalls });
  }
}

export { addRequestAttributes, addResponseAttributes, extractRequestAttributes, getOperationName, setOutputMessagesAttribute };
//# sourceMappingURL=utils.js.map
