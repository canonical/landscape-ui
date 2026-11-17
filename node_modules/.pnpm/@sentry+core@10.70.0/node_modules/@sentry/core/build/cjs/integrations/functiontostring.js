Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const currentScopes = require('../currentScopes.js');
const integration = require('../integration.js');
const object = require('../utils/object.js');

const INTEGRATION_NAME = "FunctionToString";
const SETUP_CLIENTS = /* @__PURE__ */ new WeakMap();
const _functionToStringIntegration = (() => {
  return {
    name: INTEGRATION_NAME,
    setupOnce() {
      const originalFunctionToString = Function.prototype.toString;
      try {
        Function.prototype.toString = function(...args) {
          const originalFunction = object.getOriginalFunction(this);
          let unwrappedFunction;
          try {
            if (SETUP_CLIENTS.has(currentScopes.getClient()) && originalFunction !== void 0) {
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
const functionToStringIntegration = integration.defineIntegration(_functionToStringIntegration);

exports.functionToStringIntegration = functionToStringIntegration;
//# sourceMappingURL=functiontostring.js.map
