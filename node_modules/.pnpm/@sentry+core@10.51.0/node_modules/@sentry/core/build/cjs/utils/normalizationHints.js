Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const object = require('./object.js');

/**
 * Internal symbols for normalization behavior. JSON and other structured user payloads cannot
 * carry these keys, so they cannot spoof SDK-only normalization hints.
 * We use Symbol.for to ensure that the symbols are the same across different modules/files.
 */
const SENTRY_SKIP_NORMALIZATION = Symbol.for('sentry.skipNormalization');
const SENTRY_OVERRIDE_NORMALIZATION_DEPTH = Symbol.for('sentry.overrideNormalizationDepth');

/** Marks an object so `normalize` returns it unchanged (already-normalized SDK data). */
function setSkipNormalizationHint(obj) {
  object.addNonEnumerableProperty(obj, SENTRY_SKIP_NORMALIZATION, true);
}

/** Overrides remaining normalization depth from this object downward (e.g. Redux / Pinia state). */
function setNormalizationDepthOverrideHint(obj, depth) {
  object.addNonEnumerableProperty(obj, SENTRY_OVERRIDE_NORMALIZATION_DEPTH, depth);
}

/** @internal */
function hasSkipNormalizationHint(value) {
  return Boolean((value )[SENTRY_SKIP_NORMALIZATION]);
}

/** @internal */
function getNormalizationDepthOverrideHint(value) {
  const v = (value )[SENTRY_OVERRIDE_NORMALIZATION_DEPTH];
  return typeof v === 'number' ? v : undefined;
}

exports.getNormalizationDepthOverrideHint = getNormalizationDepthOverrideHint;
exports.hasSkipNormalizationHint = hasSkipNormalizationHint;
exports.setNormalizationDepthOverrideHint = setNormalizationDepthOverrideHint;
exports.setSkipNormalizationHint = setSkipNormalizationHint;
//# sourceMappingURL=normalizationHints.js.map
