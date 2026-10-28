import { defineIntegration, SEMANTIC_ATTRIBUTE_SENTRY_OP, safeSetSpanJSONAttributes } from '@sentry/core/browser';
import { WINDOW, getHttpRequestData } from '../helpers.js';
import { URL_FULL } from '@sentry/conventions/attributes';

const httpContextIntegration = defineIntegration(() => {
  return {
    name: "HttpContext",
    preprocessEvent(event) {
      if (!WINDOW.navigator && !WINDOW.location && !WINDOW.document) {
        return;
      }
      const reqData = getHttpRequestData();
      const headers = {
        ...reqData.headers,
        ...event.request?.headers
      };
      event.request = {
        ...reqData,
        ...event.request,
        headers
      };
    },
    processSegmentSpan(span) {
      const spanOp = span.attributes?.[SEMANTIC_ATTRIBUTE_SENTRY_OP];
      if (!WINDOW.navigator && !WINDOW.location && !WINDOW.document) {
        return;
      }
      const reqData = getHttpRequestData();
      safeSetSpanJSONAttributes(span, {
        // Coerce empty string to undefined so the helper's nullish check drops it,
        // rather than writing an empty `url.full` attribute onto the span.
        [URL_FULL]: spanOp !== "http.client" ? reqData.url : void 0,
        "http.request.header.user_agent": reqData.headers["User-Agent"],
        "http.request.header.referer": reqData.headers["Referer"]
      });
    }
  };
});

export { httpContextIntegration };
//# sourceMappingURL=httpcontext.js.map
