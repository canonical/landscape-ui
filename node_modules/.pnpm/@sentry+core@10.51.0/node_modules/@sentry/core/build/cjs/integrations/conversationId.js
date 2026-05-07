Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const currentScopes = require('../currentScopes.js');
const integration = require('../integration.js');
const semanticAttributes = require('../semanticAttributes.js');
const spanUtils = require('../utils/spanUtils.js');

const INTEGRATION_NAME = 'ConversationId';

const _conversationIdIntegration = (() => {
  return {
    name: INTEGRATION_NAME,
    setup(client) {
      client.on('spanStart', (span) => {
        const scopeData = currentScopes.getCurrentScope().getScopeData();
        const isolationScopeData = currentScopes.getIsolationScope().getScopeData();

        const conversationId = scopeData.conversationId || isolationScopeData.conversationId;

        if (conversationId) {
          const { op, data: attributes, description: name } = spanUtils.spanToJSON(span);

          // Only apply conversation ID to gen_ai spans.
          // We also check for Vercel AI spans (ai.operationId attribute or ai.* span name)
          // because the Vercel AI integration sets the gen_ai.* op in its own spanStart handler
          // which fires after this, so the op is not yet available at this point.
          if (!op?.startsWith('gen_ai.') && !attributes['ai.operationId'] && !name?.startsWith('ai.')) {
            return;
          }

          span.setAttribute(semanticAttributes.GEN_AI_CONVERSATION_ID_ATTRIBUTE, conversationId);
        }
      });
    },
  };
}) ;

/**
 * Automatically applies conversation ID from scope to spans.
 *
 * This integration reads the conversation ID from the current or isolation scope
 * and applies it to spans when they start. This ensures the conversation ID is
 * available for all AI-related operations.
 */
const conversationIdIntegration = integration.defineIntegration(_conversationIdIntegration);

exports.conversationIdIntegration = conversationIdIntegration;
//# sourceMappingURL=conversationId.js.map
