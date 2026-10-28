Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const debounce = require('../utils/debounce.js');
const segmentSpanCaptureStrategy = require('./segmentSpanCaptureStrategy.js');

const CAPTURED_SPANS = /* @__PURE__ */ new WeakSet();
const isSpanAlreadyCaptured = (span) => CAPTURED_SPANS.has(span);
const markSpanCaptured = (span) => {
  CAPTURED_SPANS.add(span);
};
const CLIENT_QUEUES = /* @__PURE__ */ new WeakMap();
function _INTERNAL_setDeferSegmentSpanCapture(client) {
  if (!segmentSpanCaptureStrategy.getSegmentSpanCaptureStrategy()) {
    segmentSpanCaptureStrategy.setSegmentSpanCaptureStrategy(deferredSegmentSpanCaptureStrategy);
  }
  if (CLIENT_QUEUES.has(client)) {
    return;
  }
  const pendingCaptures = /* @__PURE__ */ new Set();
  const debouncedDrain = debounce.debounce(
    () => {
      const captures = [...pendingCaptures];
      pendingCaptures.clear();
      for (const capture of captures) {
        capture();
      }
    },
    1,
    { maxWait: 100 }
  );
  client.on("flush", () => {
    debouncedDrain.flush();
  });
  CLIENT_QUEUES.set(client, (capture) => {
    pendingCaptures.add(capture);
    debouncedDrain();
  });
}
const deferredSegmentSpanCaptureStrategy = {
  onSegmentSpanEnded(convert, scope) {
    const client = scope.getClient();
    const enqueue = client && CLIENT_QUEUES.get(client);
    if (!enqueue) {
      const transactionEvent = convert();
      if (transactionEvent) {
        client?.captureEvent(transactionEvent);
      }
      return;
    }
    enqueue(() => {
      const transactionEvent = convert({ isSpanAlreadyCaptured, onSpanCaptured: markSpanCaptured });
      if (transactionEvent) {
        client.captureEvent(transactionEvent);
      }
    });
  },
  onChildSpanEnded(span, rootSpan, convert, scope) {
    if (CAPTURED_SPANS.has(span) || !CAPTURED_SPANS.has(rootSpan)) {
      return;
    }
    const client = scope.getClient();
    const enqueue = client && CLIENT_QUEUES.get(client);
    const captureOrphan = () => {
      const transactionEvent = convert({ isSpanAlreadyCaptured, onSpanCaptured: markSpanCaptured });
      if (transactionEvent?.contexts?.trace?.data) {
        transactionEvent.contexts.trace.data["sentry.parent_span_already_sent"] = true;
      }
      if (transactionEvent) {
        client?.captureEvent(transactionEvent);
      }
    };
    if (enqueue) {
      enqueue(captureOrphan);
    } else {
      captureOrphan();
    }
  }
};

exports._INTERNAL_setDeferSegmentSpanCapture = _INTERNAL_setDeferSegmentSpanCapture;
//# sourceMappingURL=deferSegmentSpanCapture.js.map
