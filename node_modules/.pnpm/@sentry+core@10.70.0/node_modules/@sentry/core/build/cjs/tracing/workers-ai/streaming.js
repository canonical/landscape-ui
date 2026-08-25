Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const spanstatus = require('../spanstatus.js');
const utils$1 = require('../ai/utils.js');
const utils = require('./utils.js');

function accumulateStreamingToolCalls(toolCalls, accumulator) {
  for (const toolCall of toolCalls) {
    const name = toolCall.function?.name ?? toolCall.name;
    const args = toolCall.function?.arguments ?? toolCall.arguments;
    if (name == null && args == null) {
      continue;
    }
    const index = toolCall.index ?? 0;
    const existing = accumulator[index];
    if (!existing) {
      accumulator[index] = {
        index,
        id: toolCall.id,
        type: toolCall.type,
        function: {
          name,
          arguments: args ?? ""
        }
      };
    } else if (existing.function) {
      if (name && !existing.function.name) {
        existing.function.name = name;
      }
      if (args) {
        existing.function.arguments = `${existing.function.arguments ?? ""}${args}`;
      }
    }
  }
}
function processLine(line, state, recordOutputs, toolCallAccumulator) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data:")) {
    return;
  }
  const data = trimmed.slice("data:".length).trim();
  if (!data || data === "[DONE]") {
    return;
  }
  let parsed;
  try {
    parsed = JSON.parse(data);
  } catch {
    return;
  }
  if (parsed.usage) {
    if (typeof parsed.usage.prompt_tokens === "number") {
      state.promptTokens = parsed.usage.prompt_tokens;
    }
    if (typeof parsed.usage.completion_tokens === "number") {
      state.completionTokens = parsed.usage.completion_tokens;
    }
    if (typeof parsed.usage.total_tokens === "number") {
      state.totalTokens = parsed.usage.total_tokens;
    }
  }
  if (recordOutputs && typeof parsed.response === "string") {
    state.responseTexts.push(parsed.response);
  }
  if (recordOutputs && Array.isArray(parsed.tool_calls) && parsed.tool_calls.length > 0) {
    state.toolCalls.push(...parsed.tool_calls);
  }
  if (Array.isArray(parsed.choices)) {
    for (const choice of parsed.choices) {
      if (recordOutputs && typeof choice.delta?.content === "string" && choice.delta.content) {
        state.responseTexts.push(choice.delta.content);
      }
      if (recordOutputs && Array.isArray(choice.delta?.tool_calls)) {
        accumulateStreamingToolCalls(choice.delta.tool_calls, toolCallAccumulator);
      }
      if (typeof choice.finish_reason === "string") {
        state.finishReasons.push(choice.finish_reason);
      }
    }
  }
}
function instrumentWorkersAiStream(stream, span, recordOutputs) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const state = {
    responseId: "",
    responseModel: "",
    finishReasons: [],
    responseTexts: [],
    toolCalls: [],
    promptTokens: void 0,
    completionTokens: void 0,
    totalTokens: void 0
  };
  const toolCallAccumulator = {};
  let buffer = "";
  let spanEnded = false;
  const finish = () => {
    if (spanEnded) {
      return;
    }
    spanEnded = true;
    if (recordOutputs) {
      const accumulatedToolCalls = Object.values(toolCallAccumulator);
      if (accumulatedToolCalls.length > 0) {
        state.toolCalls.push(...accumulatedToolCalls);
      }
      utils.setOutputMessagesAttribute(span, {
        responseText: state.responseTexts.join(""),
        toolCalls: state.toolCalls
      });
    }
    utils$1.endStreamSpan(span, state, recordOutputs);
  };
  const flushBuffer = (isDone) => {
    const lines = buffer.split("\n");
    buffer = isDone ? "" : lines.pop() ?? "";
    for (const line of lines) {
      processLine(line, state, recordOutputs, toolCallAccumulator);
    }
  };
  return new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          buffer += decoder.decode();
          flushBuffer(true);
          finish();
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        flushBuffer(false);
        controller.enqueue(value);
      } catch (error) {
        span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" });
        finish();
        controller.error(error);
      }
    },
    async cancel(reason) {
      finish();
      await reader.cancel(reason);
    }
  });
}

exports.instrumentWorkersAiStream = instrumentWorkersAiStream;
//# sourceMappingURL=streaming.js.map
