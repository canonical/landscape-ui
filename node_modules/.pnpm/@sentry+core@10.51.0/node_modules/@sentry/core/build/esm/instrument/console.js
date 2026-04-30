import { CONSOLE_LEVELS, originalConsoleMethods } from '../utils/debug-logger.js';
import { fill } from '../utils/object.js';
import { GLOBAL_OBJ } from '../utils/worldwide.js';
import { addHandler, maybeInstrument, triggerHandlers } from './handlers.js';

/**
 * Add an instrumentation handler for when a console.xxx method is called.
 * Returns a function to remove the handler.
 *
 * Use at your own risk, this might break without changelog notice, only used internally.
 * @hidden
 */
function addConsoleInstrumentationHandler(handler) {
  const type = 'console';
  const removeHandler = addHandler(type, handler);
  maybeInstrument(type, instrumentConsole);
  return removeHandler;
}

function instrumentConsole() {
  if (!('console' in GLOBAL_OBJ)) {
    return;
  }

  CONSOLE_LEVELS.forEach(function (level) {
    if (!(level in GLOBAL_OBJ.console)) {
      return;
    }

    fill(GLOBAL_OBJ.console, level, function (originalConsoleMethod) {
      originalConsoleMethods[level] = originalConsoleMethod;

      return function (...args) {
        triggerHandlers('console', { args, level } );

        const log = originalConsoleMethods[level];
        log?.apply(GLOBAL_OBJ.console, args);
      };
    });
  });
}

export { addConsoleInstrumentationHandler };
//# sourceMappingURL=console.js.map
