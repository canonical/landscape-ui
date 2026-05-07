Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const core = require('@sentry/core');
const instrument = require('./instrument.js');
const utils = require('./utils.js');

// ElementTiming interface based on the W3C spec

const INTEGRATION_NAME = 'ElementTiming';

const _elementTimingIntegration = (() => {
  return {
    name: INTEGRATION_NAME,
    setup() {
      const performance = utils.getBrowserPerformanceAPI();
      if (!performance || !core.browserPerformanceTimeOrigin()) {
        return;
      }

      instrument.addPerformanceInstrumentationHandler('element', ({ entries }) => {
        for (const entry of entries) {
          const elementEntry = entry ;

          if (!elementEntry.identifier) {
            continue;
          }

          const identifier = elementEntry.identifier;
          const paintType = elementEntry.name ;
          const renderTime = elementEntry.renderTime;
          const loadTime = elementEntry.loadTime;

          const metricAttributes = {
            'sentry.origin': 'auto.ui.browser.element_timing',
            'ui.element.identifier': identifier,
          };

          if (paintType) {
            metricAttributes['ui.element.paint_type'] = paintType;
          }

          if (elementEntry.id) {
            metricAttributes['ui.element.id'] = elementEntry.id;
          }

          if (elementEntry.element) {
            metricAttributes['ui.element.type'] = elementEntry.element.tagName.toLowerCase();
          }

          if (elementEntry.url) {
            metricAttributes['ui.element.url'] = elementEntry.url;
          }

          if (elementEntry.naturalWidth) {
            metricAttributes['ui.element.width'] = elementEntry.naturalWidth;
          }

          if (elementEntry.naturalHeight) {
            metricAttributes['ui.element.height'] = elementEntry.naturalHeight;
          }

          if (renderTime > 0) {
            core.metrics.distribution(`ui.element.render_time`, renderTime, {
              unit: 'millisecond',
              attributes: metricAttributes,
            });
          }

          if (loadTime > 0) {
            core.metrics.distribution(`ui.element.load_time`, loadTime, {
              unit: 'millisecond',
              attributes: metricAttributes,
            });
          }
        }
      });
    },
  };
}) ;

/**
 * Captures [Element Timing API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceElementTiming)
 * data as Sentry metrics.
 *
 * To mark an element for tracking, add the `elementtiming` HTML attribute:
 * ```html
 * <img src="hero.jpg" elementtiming="hero-image" />
 * <p elementtiming="hero-text">Welcome!</p>
 * ```
 *
 * This emits `ui.element.render_time` and `ui.element.load_time` (for images)
 * as distribution metrics, tagged with the element's identifier and paint type.
 */
const elementTimingIntegration = core.defineIntegration(_elementTimingIntegration);

/**
 * @deprecated Use `elementTimingIntegration` instead. This function is a no-op and will be removed in a future version.
 */
function startTrackingElementTiming() {
  return () => undefined;
}

exports.elementTimingIntegration = elementTimingIntegration;
exports.startTrackingElementTiming = startTrackingElementTiming;
//# sourceMappingURL=elementTiming.js.map
