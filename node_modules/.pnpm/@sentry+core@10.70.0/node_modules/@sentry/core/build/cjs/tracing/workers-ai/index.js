Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const is = require('../../utils/is.js');
const spanstatus = require('../spanstatus.js');
const trace = require('../trace.js');
const providerSkip = require('../../utils/ai/providerSkip.js');
const utils = require('../ai/utils.js');
const constants = require('./constants.js');
const streaming = require('./streaming.js');
const utils$1 = require('./utils.js');

function isReadableStream(value) {
  return is.isObjectLike(value) && typeof value.pipeThrough === "function" && typeof value.getReader === "function";
}
function instrumentRun(originalRun, context, options) {
  return function instrumentedRun(...args) {
    if (providerSkip._INTERNAL_shouldSkipAiProviderWrapping(constants.WORKERS_AI_INTEGRATION_NAME)) {
      return originalRun.apply(context, args);
    }
    const [model, inputs, runOptions] = args;
    const operationName = utils$1.getOperationName(inputs);
    const requestAttributes = utils$1.extractRequestAttributes(model, inputs, operationName);
    const modelName = typeof model === "string" ? model : "unknown";
    const isStreamRequested = !!inputs && typeof inputs === "object" && inputs.stream === true;
    const returnsRawResponse = !!runOptions && typeof runOptions === "object" && (runOptions.returnRawResponse === true || runOptions.websocket === true);
    const spanConfig = {
      name: `${operationName} ${modelName}`,
      op: `gen_ai.${operationName}`,
      attributes: requestAttributes
    };
    if (isStreamRequested && !returnsRawResponse) {
      return trace.startSpanManual(spanConfig, (span) => {
        const handleError = (error) => {
          span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" });
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
          utils$1.addRequestAttributes(span, inputs, operationName, utils.shouldEnableTruncation(options.enableTruncation));
        }
        return originalResult.then((result) => {
          if (isReadableStream(result)) {
            return streaming.instrumentWorkersAiStream(result, span, options.recordOutputs);
          }
          utils$1.addResponseAttributes(span, result, options.recordOutputs);
          span.end();
          return result;
        }, handleError);
      });
    }
    return trace.startSpan(spanConfig, (span) => {
      const originalResult = originalRun.apply(context, args);
      if (options.recordInputs) {
        utils$1.addRequestAttributes(span, inputs, operationName, utils.shouldEnableTruncation(options.enableTruncation));
      }
      return originalResult.then((result) => {
        if (!returnsRawResponse) {
          utils$1.addResponseAttributes(span, result, options.recordOutputs);
        }
        return result;
      });
    });
  };
}
function instrumentWorkersAiClient(client, options) {
  const resolvedOptions = utils.resolveAIRecordingOptions(options);
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

exports.instrumentWorkersAiClient = instrumentWorkersAiClient;
//# sourceMappingURL=index.js.map
