import { getMainCarrier } from '../carrier.js';
import { _setSpanForScope } from '../utils/spanOnScope.js';
import { safeUnref } from '../utils/timer.js';
import { getAsyncContextStrategy } from './index.js';

function waitForTracingChannelBinding(callback, retries = 1) {
  const binding = getAsyncContextStrategy(getMainCarrier()).getTracingChannelBinding?.();
  if (binding) {
    callback();
    return;
  }
  if (!retries) {
    return;
  }
  safeUnref(
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
      _setSpanForScope(activeScope, span);
      return { scope: activeScope, isolationScope };
    }
  };
}

export { _INTERNAL_createTracingChannelBinding, waitForTracingChannelBinding };
//# sourceMappingURL=tracing-channel-binding.js.map
