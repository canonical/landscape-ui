import { defineIntegration, debug, startSession, captureSession, getIsolationScope } from '@sentry/core/browser';
import { whenIdleOrHidden, addHistoryInstrumentationHandler } from '@sentry/browser-utils';
import { DEBUG_BUILD } from '../debug-build.js';
import { WINDOW } from '../helpers.js';

const browserSessionIntegration = defineIntegration((options = {}) => {
  const lifecycle = options.lifecycle ?? "route";
  return {
    name: "BrowserSession",
    setupOnce() {
      if (typeof WINDOW.document === "undefined") {
        DEBUG_BUILD && debug.warn("Using the `browserSessionIntegration` in non-browser environments is not supported.");
        return;
      }
      startSession({ ignoreDuration: true });
      let initialSessionSent = false;
      whenIdleOrHidden(() => {
        if (!initialSessionSent) {
          captureSession();
          initialSessionSent = true;
        }
      });
      const isolationScope = getIsolationScope();
      let previousUser = isolationScope.getUser();
      isolationScope.addScopeListener((scope) => {
        const maybeNewUser = scope.getUser();
        if (previousUser?.id !== maybeNewUser?.id || previousUser?.ip_address !== maybeNewUser?.ip_address) {
          previousUser = maybeNewUser;
          if (initialSessionSent) {
            captureSession();
          }
        }
      });
      if (lifecycle === "route") {
        addHistoryInstrumentationHandler(({ from, to }) => {
          if (from !== to) {
            startSession({ ignoreDuration: true });
            captureSession();
            initialSessionSent = true;
          }
        });
      }
    }
  };
});

export { browserSessionIntegration };
//# sourceMappingURL=browsersession.js.map
