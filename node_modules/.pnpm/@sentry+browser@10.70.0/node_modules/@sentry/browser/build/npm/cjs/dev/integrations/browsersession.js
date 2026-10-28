Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const browser = require('@sentry/core/browser');
const browserUtils = require('@sentry/browser-utils');
const debugBuild = require('../debug-build.js');
const helpers = require('../helpers.js');

const browserSessionIntegration = browser.defineIntegration((options = {}) => {
  const lifecycle = options.lifecycle ?? "route";
  return {
    name: "BrowserSession",
    setupOnce() {
      if (typeof helpers.WINDOW.document === "undefined") {
        debugBuild.DEBUG_BUILD && browser.debug.warn("Using the `browserSessionIntegration` in non-browser environments is not supported.");
        return;
      }
      browser.startSession({ ignoreDuration: true });
      let initialSessionSent = false;
      browserUtils.whenIdleOrHidden(() => {
        if (!initialSessionSent) {
          browser.captureSession();
          initialSessionSent = true;
        }
      });
      const isolationScope = browser.getIsolationScope();
      let previousUser = isolationScope.getUser();
      isolationScope.addScopeListener((scope) => {
        const maybeNewUser = scope.getUser();
        if (previousUser?.id !== maybeNewUser?.id || previousUser?.ip_address !== maybeNewUser?.ip_address) {
          previousUser = maybeNewUser;
          if (initialSessionSent) {
            browser.captureSession();
          }
        }
      });
      if (lifecycle === "route") {
        browserUtils.addHistoryInstrumentationHandler(({ from, to }) => {
          if (from !== to) {
            browser.startSession({ ignoreDuration: true });
            browser.captureSession();
            initialSessionSent = true;
          }
        });
      }
    }
  };
});

exports.browserSessionIntegration = browserSessionIntegration;
//# sourceMappingURL=browsersession.js.map
