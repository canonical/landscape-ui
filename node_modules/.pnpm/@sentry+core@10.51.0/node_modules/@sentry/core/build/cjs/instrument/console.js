Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const debugLogger = require('../utils/debug-logger.js');
const object = require('../utils/object.js');
const worldwide = require('../utils/worldwide.js');
const handlers = require('./handlers.js');

/**
 * Add an instrumentation handler for when a console.xxx method is called.
 * Returns a function to remove the handler.
 *
 * Use at your own risk, this might break without changelog notice, only used internally.
 * @hidden
 */
function addConsoleInstrumentationHandler(handler) {
  const type = 'console';
  const removeHandler = handlers.addHandler(type, handler);
  handlers.maybeInstrument(type, instrumentConsole);
  return removeHandler;
}

function instrumentConsole() {
  if (!('console' in worldwide.GLOBAL_OBJ)) {
    return;
  }

  debugLogger.CONSOLE_LEVELS.forEach(function (level) {
    if (!(level in worldwide.GLOBAL_OBJ.console)) {
      return;
    }

    object.fill(worldwide.GLOBAL_OBJ.console, level, function (originalConsoleMethod) {
      debugLogger.originalConsoleMethods[level] = originalConsoleMethod;

      return function (...args) {
        handlers.triggerHandlers('console', { args, level } );

        const log = debugLogger.originalConsoleMethods[level];
        log?.apply(worldwide.GLOBAL_OBJ.console, args);
      };
    });
  });
}

exports.addConsoleInstrumentationHandler = addConsoleInstrumentationHandler;
//# sourceMappingURL=console.js.map
