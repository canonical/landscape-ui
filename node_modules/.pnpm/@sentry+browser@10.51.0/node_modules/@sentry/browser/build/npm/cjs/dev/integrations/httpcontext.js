Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const core = require('@sentry/core');
const helpers = require('../helpers.js');

/**
 * Collects information about HTTP request headers and
 * attaches them to the event.
 */
const httpContextIntegration = core.defineIntegration(() => {
  return {
    name: 'HttpContext',
    preprocessEvent(event) {
      // if none of the information we want exists, don't bother
      if (!helpers.WINDOW.navigator && !helpers.WINDOW.location && !helpers.WINDOW.document) {
        return;
      }

      const reqData = helpers.getHttpRequestData();
      const headers = {
        ...reqData.headers,
        ...event.request?.headers,
      };

      event.request = {
        ...reqData,
        ...event.request,
        headers,
      };
    },
    processSegmentSpan(span) {
      // if none of the information we want exists, don't bother
      if (!helpers.WINDOW.navigator && !helpers.WINDOW.location && !helpers.WINDOW.document) {
        return;
      }

      const reqData = helpers.getHttpRequestData();

      core.safeSetSpanJSONAttributes(span, {
        // Coerce empty string to undefined so the helper's nullish check drops it,
        // rather than writing an empty `url.full` attribute onto the span.
        'url.full': reqData.url || undefined,
        'http.request.header.user_agent': reqData.headers['User-Agent'],
        'http.request.header.referer': reqData.headers['Referer'],
      });
    },
  };
});

exports.httpContextIntegration = httpContextIntegration;
//# sourceMappingURL=httpcontext.js.map
