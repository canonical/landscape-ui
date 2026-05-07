Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const _exports = require('../../exports.js');
const semanticAttributes = require('../../semanticAttributes.js');
const spanstatus = require('../spanstatus.js');
const trace = require('../trace.js');
const genAiAttributes = require('../ai/gen-ai-attributes.js');
const utils = require('../langchain/utils.js');
const constants = require('./constants.js');

/**
 * Extract LLM model object from createReactAgent params
 */
function extractLLMFromParams(args) {
  const arg = args[0];
  if (typeof arg !== 'object' || !arg || !('llm' in arg) || !arg.llm || typeof arg.llm !== 'object') {
    return null;
  }
  const llm = arg.llm ;
  if (typeof llm.modelName !== 'string' && typeof llm.model !== 'string') {
    return null;
  }
  return llm;
}

/**
 * Extract agent name from createReactAgent params
 */
function extractAgentNameFromParams(args) {
  const arg = args[0];
  if (typeof arg === 'object' && !!arg && 'name' in arg && typeof arg.name === 'string') {
    return arg.name;
  }
  return null;
}

/**
 * Wraps an array of LangChain tools so each invocation creates a gen_ai.execute_tool span.
 *
 * Wraps each tool's invoke() method in place. A marker prevents double-wrapping.
 */
function wrapToolsWithSpans(tools, options, agentName) {
  const SENTRY_WRAPPED = '__sentry_tool_wrapped__';

  for (const tool of tools) {
    if (!tool || typeof tool !== 'object') {
      continue;
    }

    const t = tool ;
    const originalInvoke = t.invoke;
    if (typeof originalInvoke !== 'function' || Object.prototype.hasOwnProperty.call(t, SENTRY_WRAPPED)) {
      continue;
    }

    const toolName = typeof t.name === 'string' ? t.name : 'unknown_tool';
    const toolDescription = typeof t.description === 'string' ? t.description : undefined;

    const wrappedInvoke = new Proxy(originalInvoke , {
      apply(target, thisArg, args) {
        const spanAttributes = {
          [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: constants.LANGGRAPH_ORIGIN,
          [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: genAiAttributes.GEN_AI_EXECUTE_TOOL_OPERATION_ATTRIBUTE,
          [genAiAttributes.GEN_AI_OPERATION_NAME_ATTRIBUTE]: 'execute_tool',
          [genAiAttributes.GEN_AI_TOOL_NAME_ATTRIBUTE]: toolName,
          [genAiAttributes.GEN_AI_TOOL_TYPE_ATTRIBUTE]: 'function',
        };

        // Read agent name from LangChain's propagated config metadata at call time,
        // so shared tools get the correct agent name for each invocation
        const callConfig = args[1] ;
        const callAgentName = (callConfig?.metadata )?.lc_agent_name ?? agentName;
        if (typeof callAgentName === 'string') {
          spanAttributes[genAiAttributes.GEN_AI_AGENT_NAME_ATTRIBUTE] = callAgentName;
        }

        if (toolDescription) {
          spanAttributes[genAiAttributes.GEN_AI_TOOL_DESCRIPTION_ATTRIBUTE] = toolDescription;
        }

        // LangGraph ToolNode passes { name, args, id, type: "tool_call" }
        const input = args[0] ;
        if (typeof input === 'object' && !!input) {
          if ('id' in input && typeof input.id === 'string') {
            spanAttributes[genAiAttributes.GEN_AI_TOOL_CALL_ID_ATTRIBUTE] = input.id;
          }

          if (options.recordInputs) {
            const toolArgs = 'args' in input && typeof input.args === 'object' ? input.args : input;
            try {
              spanAttributes[genAiAttributes.GEN_AI_TOOL_INPUT_ATTRIBUTE] = JSON.stringify(toolArgs);
            } catch {
              // skip if not serializable
            }
          }
        }

        return trace.startSpan(
          {
            op: genAiAttributes.GEN_AI_EXECUTE_TOOL_OPERATION_ATTRIBUTE,
            name: `execute_tool ${toolName}`,
            attributes: spanAttributes,
          },
          async span => {
            try {
              const result = await Reflect.apply(target, thisArg, args);

              if (options.recordOutputs) {
                try {
                  // ToolMessage objects wrap the result in .content
                  const resultObj = result ;
                  const content =
                    resultObj && typeof resultObj === 'object' && 'content' in resultObj ? resultObj.content : result;
                  span.setAttribute(
                    genAiAttributes.GEN_AI_TOOL_OUTPUT_ATTRIBUTE,
                    typeof content === 'string' ? content : JSON.stringify(content),
                  );
                } catch {
                  // skip if not serializable
                }
              }

              return result;
            } catch (error) {
              span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: 'internal_error' });
              _exports.captureException(error, {
                mechanism: {
                  handled: false,
                  type: 'auto.ai.langgraph.error',
                },
              });
              throw error;
            }
          },
        );
      },
    });

    t.invoke = wrappedInvoke;
    Object.defineProperty(t, SENTRY_WRAPPED, { value: true, enumerable: false });
  }

  return tools;
}

/**
 * Extract tool calls from messages
 */
function extractToolCalls(messages) {
  if (!messages || messages.length === 0) {
    return null;
  }

  const toolCalls = [];

  for (const message of messages) {
    if (message && typeof message === 'object') {
      const msgToolCalls = message.tool_calls;
      if (msgToolCalls && Array.isArray(msgToolCalls)) {
        toolCalls.push(...msgToolCalls);
      }
    }
  }

  return toolCalls.length > 0 ? toolCalls : null;
}

/**
 * Extract token usage from a message's usage_metadata or response_metadata
 * Returns token counts without setting span attributes
 */
function extractTokenUsageFromMessage(message)

 {
  const msg = message ;
  let inputTokens = 0;
  let outputTokens = 0;
  let totalTokens = 0;

  // Extract from usage_metadata (newer format)
  if (msg.usage_metadata && typeof msg.usage_metadata === 'object') {
    const usage = msg.usage_metadata ;
    if (typeof usage.input_tokens === 'number') {
      inputTokens = usage.input_tokens;
    }
    if (typeof usage.output_tokens === 'number') {
      outputTokens = usage.output_tokens;
    }
    if (typeof usage.total_tokens === 'number') {
      totalTokens = usage.total_tokens;
    }
    return { inputTokens, outputTokens, totalTokens };
  }

  // Fallback: Extract from response_metadata.tokenUsage
  if (msg.response_metadata && typeof msg.response_metadata === 'object') {
    const metadata = msg.response_metadata ;
    if (metadata.tokenUsage && typeof metadata.tokenUsage === 'object') {
      const tokenUsage = metadata.tokenUsage ;
      if (typeof tokenUsage.promptTokens === 'number') {
        inputTokens = tokenUsage.promptTokens;
      }
      if (typeof tokenUsage.completionTokens === 'number') {
        outputTokens = tokenUsage.completionTokens;
      }
      if (typeof tokenUsage.totalTokens === 'number') {
        totalTokens = tokenUsage.totalTokens;
      }
    }
  }

  return { inputTokens, outputTokens, totalTokens };
}

/**
 * Extract model and finish reason from a message's response_metadata
 */
function extractModelMetadata(span, message) {
  const msg = message ;

  if (msg.response_metadata && typeof msg.response_metadata === 'object') {
    const metadata = msg.response_metadata ;

    if (metadata.model_name && typeof metadata.model_name === 'string') {
      span.setAttribute(genAiAttributes.GEN_AI_RESPONSE_MODEL_ATTRIBUTE, metadata.model_name);
    }

    if (metadata.finish_reason && typeof metadata.finish_reason === 'string') {
      span.setAttribute(genAiAttributes.GEN_AI_RESPONSE_FINISH_REASONS_ATTRIBUTE, [metadata.finish_reason]);
    }
  }
}

/**
 * Extract tools from compiled graph structure
 *
 * Tools are stored in: compiledGraph.builder.nodes.tools.runnable.tools
 */
function extractToolsFromCompiledGraph(compiledGraph) {
  if (!compiledGraph.builder?.nodes?.tools?.runnable?.tools) {
    return null;
  }

  const tools = compiledGraph.builder?.nodes?.tools?.runnable?.tools;

  if (!tools || !Array.isArray(tools) || tools.length === 0) {
    return null;
  }

  // Extract name, description, and schema from each tool's lc_kwargs
  return tools.map((tool) => ({
    name: tool.lc_kwargs?.name,
    description: tool.lc_kwargs?.description,
    schema: tool.lc_kwargs?.schema,
  }));
}

/**
 * Set response attributes on the span
 */
function setResponseAttributes(span, inputMessages, result) {
  // Extract messages from result
  const resultObj = result ;
  const outputMessages = resultObj?.messages;

  if (!outputMessages || !Array.isArray(outputMessages)) {
    return;
  }

  // Get new messages (delta between input and output)
  const inputCount = inputMessages?.length ?? 0;
  const newMessages = outputMessages.length > inputCount ? outputMessages.slice(inputCount) : [];

  if (newMessages.length === 0) {
    return;
  }

  // Extract and set tool calls from new messages BEFORE normalization
  // (normalization strips tool_calls, so we need to extract them first)
  const toolCalls = extractToolCalls(newMessages );
  if (toolCalls) {
    span.setAttribute(genAiAttributes.GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE, JSON.stringify(toolCalls));
  }

  // Normalize the new messages
  const normalizedNewMessages = utils.normalizeLangChainMessages(newMessages);
  span.setAttribute(genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE, JSON.stringify(normalizedNewMessages));

  // Accumulate token usage across all messages
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalTokens = 0;

  // Extract metadata from messages
  for (const message of newMessages) {
    // Accumulate token usage
    const tokens = extractTokenUsageFromMessage(message);
    totalInputTokens += tokens.inputTokens;
    totalOutputTokens += tokens.outputTokens;
    totalTokens += tokens.totalTokens;

    // Extract model metadata (last message's metadata wins for model/finish_reason)
    extractModelMetadata(span, message);
  }

  // Set accumulated token usage on span
  if (totalInputTokens > 0) {
    span.setAttribute(genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE, totalInputTokens);
  }
  if (totalOutputTokens > 0) {
    span.setAttribute(genAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE, totalOutputTokens);
  }
  if (totalTokens > 0) {
    span.setAttribute(genAiAttributes.GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE, totalTokens);
  }
}

/** Merge `sentryHandler` into a langchain `callbacks` value (`BaseCallbackHandler[]` or `BaseCallbackManager`). */
function mergeSentryCallback(existing, sentryHandler) {
  if (!existing) {
    return [sentryHandler];
  }

  if (Array.isArray(existing)) {
    if (existing.includes(sentryHandler)) {
      return existing;
    }
    return [...existing, sentryHandler];
  }

  const manager = existing ;
  if (typeof manager.addHandler === 'function') {
    const alreadyAdded = Array.isArray(manager.handlers) && manager.handlers.includes(sentryHandler);
    if (!alreadyAdded) {
      manager.addHandler(sentryHandler);
    }
  }

  return existing;
}

exports.extractAgentNameFromParams = extractAgentNameFromParams;
exports.extractLLMFromParams = extractLLMFromParams;
exports.extractModelMetadata = extractModelMetadata;
exports.extractTokenUsageFromMessage = extractTokenUsageFromMessage;
exports.extractToolCalls = extractToolCalls;
exports.extractToolsFromCompiledGraph = extractToolsFromCompiledGraph;
exports.mergeSentryCallback = mergeSentryCallback;
exports.setResponseAttributes = setResponseAttributes;
exports.wrapToolsWithSpans = wrapToolsWithSpans;
//# sourceMappingURL=utils.js.map
