import { getClient } from '../currentScopes.js';
import { defineIntegration } from '../integration.js';
import { getOriginalFunction } from '../utils/object.js';

const INTEGRATION_NAME = "FunctionToString";
const SETUP_CLIENTS = /* @__PURE__ */ new WeakMap();
const _functionToStringIntegration = (() => {
  return {
    name: INTEGRATION_NAME,
    setupOnce() {
      const originalFunctionToString = Function.prototype.toString;
      try {
        Function.prototype.toString = function(...args) {
          const originalFunction = getOriginalFunction(this);
          let unwrappedFunction;
          try {
            if (SETUP_CLIENTS.has(getClient()) && originalFunction !== void 0) {
              unwrappedFunction = originalFunction;
            }
          } catch {
          }
          return originalFunctionToString.apply(unwrappedFunction ?? this, args);
        };
      } catch {
      }
    },
    setup(client) {
      SETUP_CLIENTS.set(client, true);
    }
  };
});
const functionToStringIntegration = defineIntegration(_functionToStringIntegration);

export { functionToStringIntegration };
//# sourceMappingURL=functiontostring.js.map
