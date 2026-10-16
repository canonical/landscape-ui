Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const browser = require('@sentry/core/browser');
const browserUtils = require('@sentry/browser-utils');

const WEB_VITALS_INTEGRATION_NAME = "WebVitals";
const webVitalsIntegration = browser.defineIntegration((options = {}) => {
  const ignored = new Set(options.ignore ?? []);
  return {
    name: WEB_VITALS_INTEGRATION_NAME,
    setup(client) {
      const spanStreamingEnabled = browser.hasSpanStreamingEnabled(client);
      const { enableStandaloneClsSpans, enableStandaloneLcpSpans } = options._experiments ?? {};
      const recordClsStandaloneSpans = spanStreamingEnabled || ignored.has("cls") ? void 0 : enableStandaloneClsSpans || false;
      const recordLcpStandaloneSpans = spanStreamingEnabled || ignored.has("lcp") ? void 0 : enableStandaloneLcpSpans || false;
      const finalizeWebVitals = browserUtils.startTrackingWebVitals({
        recordClsStandaloneSpans,
        recordLcpStandaloneSpans,
        client
      });
      const pageloadSpans = /* @__PURE__ */ new WeakSet();
      client.on("afterStartPageLoadSpan", (span) => {
        pageloadSpans.add(span);
      });
      client.on("spanEnd", (span) => {
        if (!pageloadSpans.delete(span)) {
          return;
        }
        finalizeWebVitals();
        browserUtils.addWebVitalsToSpan(span, {
          // CLS/LCP are recorded as pageload span measurements only when they're neither
          // tracked as standalone spans nor handled by span streaming (and not ignored).
          recordClsOnPageloadSpan: recordClsStandaloneSpans === false,
          recordLcpOnPageloadSpan: recordLcpStandaloneSpans === false,
          spanStreamingEnabled
        });
      });
      if (spanStreamingEnabled) {
        if (!ignored.has("lcp")) {
          browserUtils.trackLcpAsSpan(client);
        }
        if (!ignored.has("cls")) {
          browserUtils.trackClsAsSpan(client);
        }
        if (!ignored.has("inp")) {
          browserUtils.trackInpAsSpan();
        }
      } else if (!ignored.has("inp")) {
        browserUtils.startTrackingINP();
      }
    },
    afterAllSetup() {
      if (!ignored.has("inp")) {
        browserUtils.registerInpInteractionListener();
      }
    }
  };
});

exports.WEB_VITALS_INTEGRATION_NAME = WEB_VITALS_INTEGRATION_NAME;
exports.webVitalsIntegration = webVitalsIntegration;
//# sourceMappingURL=webVitals.js.map
