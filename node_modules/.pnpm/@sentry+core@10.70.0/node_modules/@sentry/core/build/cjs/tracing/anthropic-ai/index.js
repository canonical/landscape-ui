Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const exports$1 = require('../../exports.js');
const semanticAttributes = require('../../semanticAttributes.js');
const spanstatus = require('../spanstatus.js');
const trace = require('../trace.js');
const genAiAttributes = require('../ai/gen-ai-attributes.js');
const utils$1 = require('../ai/utils.js');
const constants = require('./constants.js');
const streaming = require('./streaming.js');
const utils = require('./utils.js');

let suppressDelegatedCreate = false;
const INSTRUMENTED_METHODS = /* @__PURE__ */ new WeakSet();
function extractRequestAttributes(args, methodPath, operationName) {
  const attributes = {
    [genAiAttributes.GEN_AI_SYSTEM_ATTRIBUTE]: "anthropic",
    [genAiAttributes.GEN_AI_OPERATION_NAME_ATTRIBUTE]: operationName,
    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.ai.anthropic"
  };
  if (args.length > 0 && typeof args[0] === "object" && args[0] !== null) {
    const params = args[0];
    if (params.tools && Array.isArray(params.tools)) {
      attributes[genAiAttributes.GEN_AI_REQUEST_AVAILABLE_TOOLS_ATTRIBUTE] = JSON.stringify(params.tools);
    }
    attributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] = params.model ?? "unknown";
    if ("temperature" in params) attributes[genAiAttributes.GEN_AI_REQUEST_TEMPERATURE_ATTRIBUTE] = params.temperature;
    if ("top_p" in params) attributes[genAiAttributes.GEN_AI_REQUEST_TOP_P_ATTRIBUTE] = params.top_p;
    if ("stream" in params) attributes[genAiAttributes.GEN_AI_REQUEST_STREAM_ATTRIBUTE] = params.stream;
    if ("top_k" in params) attributes[genAiAttributes.GEN_AI_REQUEST_TOP_K_ATTRIBUTE] = params.top_k;
    if ("frequency_penalty" in params)
      attributes[genAiAttributes.GEN_AI_REQUEST_FREQUENCY_PENALTY_ATTRIBUTE] = params.frequency_penalty;
    if ("max_tokens" in params) attributes[genAiAttributes.GEN_AI_REQUEST_MAX_TOKENS_ATTRIBUTE] = params.max_tokens;
  } else {
    if (methodPath === "models.retrieve" || methodPath === "models.get") {
      attributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] = args[0];
    } else {
      attributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] = "unknown";
    }
  }
  return attributes;
}
function addPrivateRequestAttributes(span, params, enableTruncation) {
  const messages = utils.messagesFromParams(params);
  utils.setMessagesAttribute(span, messages, enableTruncation);
  if ("prompt" in params) {
    span.setAttributes({ [genAiAttributes.GEN_AI_PROMPT_ATTRIBUTE]: JSON.stringify(params.prompt) });
  }
}
function addContentAttributes(span, response) {
  if ("content" in response) {
    if (Array.isArray(response.content)) {
      span.setAttributes({
        [genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE]: response.content.map((item) => item.text).filter((text) => !!text).join("")
      });
      const toolCalls = [];
      for (const item of response.content) {
        if (item.type === "tool_use" || item.type === "server_tool_use") {
          toolCalls.push(item);
        }
      }
      if (toolCalls.length > 0) {
        span.setAttributes({ [genAiAttributes.GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE]: JSON.stringify(toolCalls) });
      }
    }
  }
  if ("completion" in response) {
    span.setAttributes({ [genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE]: response.completion });
  }
  if ("input_tokens" in response) {
    span.setAttributes({ [genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE]: JSON.stringify(response.input_tokens) });
  }
}
function addMetadataAttributes(span, response) {
  if ("id" in response && "model" in response) {
    span.setAttributes({
      [genAiAttributes.GEN_AI_RESPONSE_ID_ATTRIBUTE]: response.id,
      [genAiAttributes.GEN_AI_RESPONSE_MODEL_ATTRIBUTE]: response.model
    });
    if ("usage" in response && response.usage) {
      utils$1.setTokenUsageAttributes(
        span,
        response.usage.input_tokens,
        response.usage.output_tokens,
        response.usage.cache_creation_input_tokens,
        response.usage.cache_read_input_tokens
      );
    }
  }
}
function addResponseAttributes(span, response, recordOutputs) {
  if (!response || typeof response !== "object") return;
  if ("type" in response && response.type === "error") {
    utils.handleResponseError(span, response);
    return;
  }
  if (recordOutputs) {
    addContentAttributes(span, response);
  }
  addMetadataAttributes(span, response);
}
function handleStreamingError(error, span, methodPath) {
  exports$1.captureException(error, {
    mechanism: { handled: false, type: "auto.ai.anthropic", data: { function: methodPath } }
  });
  if (span.isRecording()) {
    span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" });
    span.end();
  }
  throw error;
}
function handleStreamingRequest(target, invocationThis, args, requestAttributes, operationName, methodPath, params, options, isStreamRequested, isStreamingMethod) {
  const model = requestAttributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] ?? "unknown";
  const spanConfig = {
    name: `${operationName} ${model}`,
    op: `gen_ai.${operationName}`,
    attributes: requestAttributes
  };
  if (isStreamRequested && !isStreamingMethod) {
    let originalResult;
    const instrumentedPromise = trace.startSpanManual(spanConfig, (span) => {
      originalResult = target.apply(invocationThis, args);
      if (options.recordInputs && params) {
        addPrivateRequestAttributes(span, params, utils$1.shouldEnableTruncation(options.enableTruncation));
      }
      return (async () => {
        try {
          const result = await originalResult;
          return streaming.instrumentAsyncIterableStream(
            result,
            span,
            options.recordOutputs ?? false
          );
        } catch (error) {
          return handleStreamingError(error, span, methodPath);
        }
      })();
    });
    return utils$1.wrapPromiseWithMethods(originalResult, instrumentedPromise, "auto.ai.anthropic");
  } else {
    return trace.startSpanManual(spanConfig, (span) => {
      try {
        if (options.recordInputs && params) {
          addPrivateRequestAttributes(span, params, utils$1.shouldEnableTruncation(options.enableTruncation));
        }
        suppressDelegatedCreate = true;
        const messageStream = target.apply(invocationThis, args);
        suppressDelegatedCreate = false;
        return streaming.instrumentMessageStream(messageStream, span, options.recordOutputs ?? false);
      } catch (error) {
        suppressDelegatedCreate = false;
        return handleStreamingError(error, span, methodPath);
      }
    });
  }
}
function instrumentMethod(originalMethod, methodPath, instrumentedMethod, context, options) {
  return new Proxy(originalMethod, {
    apply(target, thisArg, args) {
      const invocationThis = thisArg !== void 0 ? thisArg : context;
      const isStreamingMethod = instrumentedMethod.streaming === true;
      if (!isStreamingMethod && suppressDelegatedCreate) {
        return target.apply(invocationThis, args);
      }
      const operationName = instrumentedMethod.operation || "unknown";
      const requestAttributes = extractRequestAttributes(args, methodPath, operationName);
      const model = requestAttributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] ?? "unknown";
      const params = typeof args[0] === "object" ? args[0] : void 0;
      const isStreamRequested = Boolean(params?.stream);
      if (isStreamRequested || isStreamingMethod) {
        return handleStreamingRequest(
          target,
          invocationThis,
          args,
          requestAttributes,
          operationName,
          methodPath,
          params,
          options,
          isStreamRequested,
          isStreamingMethod
        );
      }
      let originalResult;
      const instrumentedPromise = trace.startSpan(
        {
          name: `${operationName} ${model}`,
          op: `gen_ai.${operationName}`,
          attributes: requestAttributes
        },
        (span) => {
          originalResult = target.apply(invocationThis, args);
          if (options.recordInputs && params) {
            addPrivateRequestAttributes(span, params, utils$1.shouldEnableTruncation(options.enableTruncation));
          }
          return originalResult.then(
            (result) => {
              addResponseAttributes(span, result, options.recordOutputs);
              return result;
            },
            (error) => {
              exports$1.captureException(error, {
                mechanism: {
                  handled: false,
                  type: "auto.ai.anthropic",
                  data: {
                    function: methodPath
                  }
                }
              });
              throw error;
            }
          );
        }
      );
      return utils$1.wrapPromiseWithMethods(originalResult, instrumentedPromise, "auto.ai.anthropic");
    }
  });
}
function instrumentClientInPlace(client, options) {
  for (const methodPath of Object.keys(constants.ANTHROPIC_METHOD_REGISTRY)) {
    const segments = methodPath.split(".");
    const methodName = segments.pop();
    let owner = client;
    for (const segment of segments) {
      owner = owner?.[segment];
    }
    if (!owner || typeof owner[methodName] !== "function") {
      continue;
    }
    const originalMethod = owner[methodName];
    if (INSTRUMENTED_METHODS.has(originalMethod)) {
      continue;
    }
    const instrumented = instrumentMethod(
      originalMethod,
      methodPath,
      constants.ANTHROPIC_METHOD_REGISTRY[methodPath],
      owner,
      options
    );
    INSTRUMENTED_METHODS.add(instrumented);
    owner[methodName] = instrumented;
  }
  return client;
}
function instrumentAnthropicAiClient(anthropicAiClient, options) {
  return instrumentClientInPlace(anthropicAiClient, utils$1.resolveAIRecordingOptions(options));
}

exports.addPrivateRequestAttributes = addPrivateRequestAttributes;
exports.addResponseAttributes = addResponseAttributes;
exports.extractRequestAttributes = extractRequestAttributes;
exports.instrumentAnthropicAiClient = instrumentAnthropicAiClient;
//# sourceMappingURL=index.js.map
