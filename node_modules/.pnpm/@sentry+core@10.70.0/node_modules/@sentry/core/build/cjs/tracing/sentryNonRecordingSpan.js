Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const object = require('../utils/object.js');
const propagationContext = require('../utils/propagationContext.js');
const spanUtils = require('../utils/spanUtils.js');

const NON_RECORDING_SPAN_FIELD = /* @__PURE__ */ Symbol.for("sentry.nonRecordingSpan");
class SentryNonRecordingSpan {
  constructor(spanContext = {}) {
    this._traceId = spanContext.traceId || propagationContext.generateTraceId();
    this._spanId = spanContext.spanId || propagationContext.generateSpanId();
    this.dropReason = spanContext.dropReason;
    object.addNonEnumerableProperty(this, NON_RECORDING_SPAN_FIELD, true);
  }
  /** @inheritdoc */
  spanContext() {
    return {
      spanId: this._spanId,
      traceId: this._traceId,
      traceFlags: spanUtils.TRACE_FLAG_NONE
    };
  }
  /** @inheritdoc */
  end(_timestamp) {
  }
  /** @inheritdoc */
  setAttribute(_key, _value) {
    return this;
  }
  /** @inheritdoc */
  setAttributes(_values) {
    return this;
  }
  /** @inheritdoc */
  setStatus(_status) {
    return this;
  }
  /** @inheritdoc */
  updateName(_name) {
    return this;
  }
  /** @inheritdoc */
  isRecording() {
    return false;
  }
  /** @inheritdoc */
  addEvent(_name, _attributesOrStartTime, _startTime) {
    return this;
  }
  /** @inheritDoc */
  addLink(_link) {
    return this;
  }
  /** @inheritDoc */
  addLinks(_links) {
    return this;
  }
  /**
   * This should generally not be used,
   * but we need it for being compliant with the OTEL Span interface.
   *
   * @hidden
   * @internal
   */
  recordException(_exception, _time) {
  }
}
function spanIsNonRecordingSpan(span) {
  return !!span && span[NON_RECORDING_SPAN_FIELD] === true;
}

exports.SentryNonRecordingSpan = SentryNonRecordingSpan;
exports.spanIsNonRecordingSpan = spanIsNonRecordingSpan;
//# sourceMappingURL=sentryNonRecordingSpan.js.map
