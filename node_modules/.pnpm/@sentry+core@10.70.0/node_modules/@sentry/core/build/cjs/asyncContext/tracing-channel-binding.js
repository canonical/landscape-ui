Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const carrier = require('../carrier.js');
const spanOnScope = require('../utils/spanOnScope.js');
const timer = require('../utils/timer.js');
const index = require('./index.js');

function waitForTracingChannelBinding(callback, retries = 1) {
  const binding = index.getAsyncContextStrategy(carrier.getMainCarrier()).getTracingChannelBinding?.();
  if (binding) {
    callback();
    return;
  }
  if (!retries) {
    return;
  }
  timer.safeUnref(
    setTimeout(() => {
      waitForTracingChannelBinding(callback, retries - 1);
    }, 1)
  );
}
function _INTERNAL_createTracingChannelBinding(asyncLocalStorage, getScopes) {
  return {
    asyncLocalStorage,
    getStoreWithActiveSpan: (span) => {
      const { scope, isolationScope } = getScopes();
      const activeScope = scope.clone();
      spanOnScope._setSpanForScope(activeScope, span);
      return { scope: activeScope, isolationScope };
    }
  };
}

exports._INTERNAL_createTracingChannelBinding = _INTERNAL_createTracingChannelBinding;
exports.waitForTracingChannelBinding = waitForTracingChannelBinding;
//# sourceMappingURL=tracing-channel-binding.js.map
