Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const currentScopes = require('../currentScopes.js');
const debugBuild = require('../debug-build.js');
const console = require('../instrument/console.js');
const integration = require('../integration.js');
const semanticAttributes = require('../semanticAttributes.js');
const debugLogger = require('../utils/debug-logger.js');
const is = require('../utils/is.js');
const normalize = require('../utils/normalize.js');
const internal = require('./internal.js');
const utils = require('./utils.js');

const INTEGRATION_NAME = "ConsoleLogs";
const DEFAULT_ATTRIBUTES = {
  [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.log.console"
};
const _consoleLoggingIntegration = ((options = {}) => {
  const levels = options.levels || debugLogger.CONSOLE_LEVELS;
  return {
    name: INTEGRATION_NAME,
    setup(client) {
      const { enableLogs, normalizeDepth = 3, normalizeMaxBreadth = 1e3 } = client.getOptions();
      if (!enableLogs) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.warn("`enableLogs` is not enabled, ConsoleLogs integration disabled");
        return;
      }
      const unsubscribe = console.addConsoleInstrumentationHandler(({ args, level }) => {
        if (currentScopes.getClient() !== client || !levels.includes(level)) {
          return;
        }
        const firstArg = args[0];
        const followingArgs = args.slice(1);
        if (level === "assert") {
          if (!firstArg) {
            const assertionMessage = followingArgs.length > 0 ? `Assertion failed: ${utils.formatConsoleArgs(followingArgs, normalizeDepth, normalizeMaxBreadth)}` : "Assertion failed";
            internal._INTERNAL_captureLog({ level: "error", message: assertionMessage, attributes: DEFAULT_ATTRIBUTES });
          }
          return;
        }
        const isLevelLog = level === "log";
        const attributes = { ...DEFAULT_ATTRIBUTES };
        if (is.isPlainObject(firstArg)) {
          Object.assign(attributes, normalize.normalize(firstArg, normalizeDepth, normalizeMaxBreadth));
          const remainingArgsStartIndex = typeof args[1] === "string" ? 2 : 1;
          const remainingArgs = args.slice(remainingArgsStartIndex);
          remainingArgs.forEach((arg, index) => {
            attributes[`sentry.message.parameter.${index}`] = normalize.normalize(arg, normalizeDepth, normalizeMaxBreadth);
          });
        } else {
          const shouldGenerateTemplate = followingArgs.length > 0 && typeof firstArg === "string" && !utils.hasConsoleSubstitutions(firstArg);
          if (shouldGenerateTemplate) {
            const templateAttrs = utils.createConsoleTemplateAttributes(firstArg, followingArgs);
            for (const [key, value] of Object.entries(templateAttrs)) {
              attributes[key] = key.startsWith("sentry.message.parameter.") ? normalize.normalize(value, normalizeDepth, normalizeMaxBreadth) : value;
            }
          }
        }
        internal._INTERNAL_captureLog({
          level: isLevelLog ? "info" : level,
          message: utils.formatConsoleArgs(args, normalizeDepth, normalizeMaxBreadth),
          severityNumber: isLevelLog ? 10 : void 0,
          attributes
        });
      });
      client.registerCleanup(unsubscribe);
    }
  };
});
const consoleLoggingIntegration = integration.defineIntegration(_consoleLoggingIntegration);

exports.consoleLoggingIntegration = consoleLoggingIntegration;
//# sourceMappingURL=console-integration.js.map
