Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const carrier = require('../carrier.js');

function setSegmentSpanCaptureStrategy(strategy) {
  carrier.getSentryCarrier(carrier.getMainCarrier()).segmentSpanCaptureStrategy = strategy;
}
function getSegmentSpanCaptureStrategy() {
  return carrier.getSentryCarrier(carrier.getMainCarrier()).segmentSpanCaptureStrategy;
}

exports.getSegmentSpanCaptureStrategy = getSegmentSpanCaptureStrategy;
exports.setSegmentSpanCaptureStrategy = setSegmentSpanCaptureStrategy;
//# sourceMappingURL=segmentSpanCaptureStrategy.js.map
