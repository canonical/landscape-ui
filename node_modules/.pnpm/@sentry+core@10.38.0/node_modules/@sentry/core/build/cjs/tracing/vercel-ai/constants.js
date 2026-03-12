Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

// Global Map to track tool call IDs to their corresponding spans
// This allows us to capture tool errors and link them to the correct span
const toolCallSpanMap = new Map();

// Operation sets for efficient mapping to OpenTelemetry semantic convention values
const INVOKE_AGENT_OPS = new Set([
  'ai.generateText',
  'ai.streamText',
  'ai.generateObject',
  'ai.streamObject',
  'ai.embed',
  'ai.embedMany',
]);

const GENERATE_CONTENT_OPS = new Set([
  'ai.generateText.doGenerate',
  'ai.streamText.doStream',
  'ai.generateObject.doGenerate',
  'ai.streamObject.doStream',
]);

const EMBEDDINGS_OPS = new Set(['ai.embed.doEmbed', 'ai.embedMany.doEmbed']);

exports.EMBEDDINGS_OPS = EMBEDDINGS_OPS;
exports.GENERATE_CONTENT_OPS = GENERATE_CONTENT_OPS;
exports.INVOKE_AGENT_OPS = INVOKE_AGENT_OPS;
exports.toolCallSpanMap = toolCallSpanMap;
//# sourceMappingURL=constants.js.map
