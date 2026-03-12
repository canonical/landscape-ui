Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const _exports = require('../../exports.js');
const spanstatus = require('../spanstatus.js');
const genAiAttributes = require('../ai/gen-ai-attributes.js');
const utils = require('../ai/utils.js');
const constants = require('./constants.js');

/**
 * Check if a method path should be instrumented
 */
function shouldInstrument(methodPath) {
  return constants.ANTHROPIC_AI_INSTRUMENTED_METHODS.includes(methodPath );
}

/**
 * Set the messages and messages original length attributes.
 * Extracts system instructions before truncation.
 */
function setMessagesAttribute(span, messages) {
  if (Array.isArray(messages) && messages.length === 0) {
    return;
  }

  const { systemInstructions, filteredMessages } = utils.extractSystemInstructions(messages);

  if (systemInstructions) {
    span.setAttributes({
      [genAiAttributes.GEN_AI_SYSTEM_INSTRUCTIONS_ATTRIBUTE]: systemInstructions,
    });
  }

  const filteredLength = Array.isArray(filteredMessages) ? filteredMessages.length : 1;
  span.setAttributes({
    [genAiAttributes.GEN_AI_INPUT_MESSAGES_ATTRIBUTE]: utils.getTruncatedJsonString(filteredMessages),
    [genAiAttributes.GEN_AI_INPUT_MESSAGES_ORIGINAL_LENGTH_ATTRIBUTE]: filteredLength,
  });
}

/**
 * Capture error information from the response
 * @see https://docs.anthropic.com/en/api/errors#error-shapes
 */
function handleResponseError(span, response) {
  if (response.error) {
    span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: response.error.type || 'internal_error' });

    _exports.captureException(response.error, {
      mechanism: {
        handled: false,
        type: 'auto.ai.anthropic.anthropic_error',
      },
    });
  }
}

/**
 * Include the system prompt in the messages list, if available
 */
function messagesFromParams(params) {
  const { system, messages, input } = params;

  const systemMessages = typeof system === 'string' ? [{ role: 'system', content: params.system }] : [];

  const inputParamMessages = Array.isArray(input) ? input : input != null ? [input] : undefined;

  const messagesParamMessages = Array.isArray(messages) ? messages : messages != null ? [messages] : [];

  const userMessages = inputParamMessages ?? messagesParamMessages;

  return [...systemMessages, ...userMessages];
}

exports.handleResponseError = handleResponseError;
exports.messagesFromParams = messagesFromParams;
exports.setMessagesAttribute = setMessagesAttribute;
exports.shouldInstrument = shouldInstrument;
//# sourceMappingURL=utils.js.map
