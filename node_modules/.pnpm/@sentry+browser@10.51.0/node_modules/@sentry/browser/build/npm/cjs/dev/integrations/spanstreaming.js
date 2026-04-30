Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const core = require('@sentry/core');
const debugBuild = require('../debug-build.js');

const spanStreamingIntegration = core.defineIntegration(() => {
  return {
    name: 'SpanStreaming',

    beforeSetup(client) {
      // If users only set spanStreamingIntegration, without traceLifecycle, we set it to "stream" for them.
      // This avoids the classic double-opt-in problem we'd otherwise have in the browser SDK.
      const clientOptions = client.getOptions();
      if (!clientOptions.traceLifecycle) {
        debugBuild.DEBUG_BUILD && core.debug.log('[SpanStreaming] setting `traceLifecycle` to "stream"');
        clientOptions.traceLifecycle = 'stream';
      }
    },

    setup(client) {
      const initialMessage = 'SpanStreaming integration requires';
      const fallbackMsg = 'Falling back to static trace lifecycle.';
      const clientOptions = client.getOptions();

      if (!core.hasSpanStreamingEnabled(client)) {
        clientOptions.traceLifecycle = 'static';
        debugBuild.DEBUG_BUILD && core.debug.warn(`${initialMessage} \`traceLifecycle\` to be set to "stream"! ${fallbackMsg}`);
        return;
      }

      const beforeSendSpan = clientOptions.beforeSendSpan;
      // If users misconfigure their SDK by opting into span streaming but
      // using an incompatible beforeSendSpan callback, we fall back to the static trace lifecycle.
      if (beforeSendSpan && !core.isStreamedBeforeSendSpanCallback(beforeSendSpan)) {
        clientOptions.traceLifecycle = 'static';
        debugBuild.DEBUG_BUILD &&
          core.debug.warn(`${initialMessage} a beforeSendSpan callback using \`withStreamedSpan\`! ${fallbackMsg}`);
        return;
      }

      const buffer = new core.SpanBuffer(client);

      client.on('afterSpanEnd', span => {
        // Negatively sampled spans must not be captured.
        // This happens because OTel and we create non-recording spans for negatively sampled spans
        // that go through the same life cycle as recording spans.
        if (!core.spanIsSampled(span)) {
          return;
        }
        buffer.add(core.captureSpan(span, client));
      });

      // In addition to capturing the span, we also flush the trace when the segment
      // span ends to ensure things are sent timely. We never know when the browser
      // is closed, users navigate away, etc.
      client.on('afterSegmentSpanEnd', segmentSpan => {
        const traceId = segmentSpan.spanContext().traceId;
        setTimeout(() => {
          buffer.flush(traceId);
        }, 500);
      });
    },
  };
}) ;

exports.spanStreamingIntegration = spanStreamingIntegration;
//# sourceMappingURL=spanstreaming.js.map
