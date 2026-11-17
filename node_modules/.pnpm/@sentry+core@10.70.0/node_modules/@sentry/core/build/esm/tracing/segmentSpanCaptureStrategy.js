import { getSentryCarrier, getMainCarrier } from '../carrier.js';

function setSegmentSpanCaptureStrategy(strategy) {
  getSentryCarrier(getMainCarrier()).segmentSpanCaptureStrategy = strategy;
}
function getSegmentSpanCaptureStrategy() {
  return getSentryCarrier(getMainCarrier()).segmentSpanCaptureStrategy;
}

export { getSegmentSpanCaptureStrategy, setSegmentSpanCaptureStrategy };
//# sourceMappingURL=segmentSpanCaptureStrategy.js.map
