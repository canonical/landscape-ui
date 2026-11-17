import { isObjectLike } from '../../utils/is.js';
import { SPAN_STATUS_ERROR } from '../spanstatus.js';
import { startSpanManual, startSpan } from '../trace.js';
import { _INTERNAL_shouldSkipAiProviderWrapping } from '../../utils/ai/providerSkip.js';
import { resolveAIRecordingOptions, shouldEnableTruncation } from '../ai/utils.js';
import { WORKERS_AI_INTEGRATION_NAME } from './constants.js';
import { instrumentWorkersAiStream } from './streaming.js';
import { extractRequestAttributes, addRequestAttributes, addResponseAttributes, getOperationName } from './utils.js';

function isReadableStream(value) {
  return isObjectLike(value) && typeof value.pipeThrough === "function" && typeof value.getReader === "function";
}
function instrumentRun(originalRun, context, options) {
  return function instrumentedRun(...args) {
    if (_INTERNAL_shouldSkipAiProviderWrapping(WORKERS_AI_INTEGRATION_NAME)) {
      return originalRun.apply(context, args);
    }
    const [model, inputs, runOptions] = args;
    const operationName = getOperationName(inputs);
    const requestAttributes = extractRequestAttributes(model, inputs, operationName);
    const modelName = typeof model === "string" ? model : "unknown";
    const isStreamRequested = !!inputs && typeof inputs === "object" && inputs.stream === true;
    const returnsRawResponse = !!runOptions && typeof runOptions === "object" && (runOptions.returnRawResponse === true || runOptions.websocket === true);
    const spanConfig = {
      name: `${operationName} ${modelName}`,
      op: `gen_ai.${operationName}`,
      attributes: requestAttributes
    };
    if (isStreamRequested && !returnsRawResponse) {
      return startSpanManual(spanConfig, (span) => {
        const handleError = (error) => {
          span.setStatus({ code: SPAN_STATUS_ERROR, message: "internal_error" });
          span.end();
          throw error;
        };
        let originalResult;
        try {
          originalResult = originalRun.apply(context, args);
        } catch (error) {
          return handleError(error);
        }
        if (options.recordInputs) {
          addRequestAttributes(span, inputs, operationName, shouldEnableTruncation(options.enableTruncation));
        }
        return originalResult.then((result) => {
          if (isReadableStream(result)) {
            return instrumentWorkersAiStream(result, span, options.recordOutputs);
          }
          addResponseAttributes(span, result, options.recordOutputs);
          span.end();
          return result;
        }, handleError);
      });
    }
    return startSpan(spanConfig, (span) => {
      const originalResult = originalRun.apply(context, args);
      if (options.recordInputs) {
        addRequestAttributes(span, inputs, operationName, shouldEnableTruncation(options.enableTruncation));
      }
      return originalResult.then((result) => {
        if (!returnsRawResponse) {
          addResponseAttributes(span, result, options.recordOutputs);
        }
        return result;
      });
    });
  };
}
function instrumentWorkersAiClient(client, options) {
  const resolvedOptions = resolveAIRecordingOptions(options);
  const instrumented = new Proxy(client, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (prop === "run" && typeof value === "function") {
        return instrumentRun(value, target, resolvedOptions);
      }
      return typeof value === "function" ? value.bind(target) : value;
    }
  });
  return instrumented;
}

export { instrumentWorkersAiClient };
//# sourceMappingURL=index.js.map
