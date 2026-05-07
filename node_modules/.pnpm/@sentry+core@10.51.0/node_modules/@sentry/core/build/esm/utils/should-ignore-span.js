import { DEBUG_BUILD } from '../debug-build.js';
import { debug } from './debug-logger.js';
import { isMatchingPattern } from './string.js';

function logIgnoredSpan(droppedSpan) {
  debug.log(`Ignoring span ${droppedSpan.op} - ${droppedSpan.description} because it matches \`ignoreSpans\`.`);
}

/**
 * Check if a span should be ignored based on the ignoreSpans configuration.
 */
function shouldIgnoreSpan(
  span,
  ignoreSpans,
) {
  if (!ignoreSpans?.length) {
    return false;
  }

  for (const pattern of ignoreSpans) {
    if (isStringOrRegExp(pattern)) {
      if (span.description && isMatchingPattern(span.description, pattern)) {
        DEBUG_BUILD && logIgnoredSpan(span);
        return true;
      }
      continue;
    }

    const hasAttributes = !!pattern.attributes && Object.keys(pattern.attributes).length > 0;
    if (!pattern.name && !pattern.op && !hasAttributes) {
      continue;
    }

    const nameMatches = pattern.name ? span.description && isMatchingPattern(span.description, pattern.name) : true;
    const opMatches = pattern.op ? span.op && isMatchingPattern(span.op, pattern.op) : true;
    const attrsMatch = pattern.attributes
      ? Object.entries(pattern.attributes).every(([key, valuePattern]) =>
          _matchesAttributeValue(span.attributes?.[key], valuePattern),
        )
      : true;

    // This check here is only correct because we can guarantee that we ran `isMatchingPattern`
    // for at least one of `nameMatches`, `opMatches`, or `attrsMatch`. So in contrary to how this looks,
    // not all of op, name, and attributes actually have to match. This is the most efficient way to check
    // for all combinations of name, op, and attribute patterns.
    if (nameMatches && opMatches && attrsMatch) {
      DEBUG_BUILD && logIgnoredSpan(span);
      return true;
    }
  }

  return false;
}

function _matchesAttributeValue(actual, pat) {
  // String values support pattern matching
  if (typeof actual === 'string' && (typeof pat === 'string' || pat instanceof RegExp)) {
    return isMatchingPattern(actual, pat);
  }
  // Arrays: element-wise strict equality
  if (Array.isArray(actual) && Array.isArray(pat)) {
    return actual.length === pat.length && actual.every((v, i) => v === pat[i]);
  }
  // Primitives: strict equality
  return actual === pat;
}

/**
 * Takes a list of spans, and a span that was dropped, and re-parents the child spans of the dropped span to the parent of the dropped span, if possible.
 * This mutates the spans array in place!
 */
function reparentChildSpans(spans, dropSpan) {
  const droppedSpanParentId = dropSpan.parent_span_id;
  const droppedSpanId = dropSpan.span_id;

  // This should generally not happen, as we do not apply this on root spans
  // but to be safe, we just bail in this case
  if (!droppedSpanParentId) {
    return;
  }

  for (const span of spans) {
    if (span.parent_span_id === droppedSpanId) {
      span.parent_span_id = droppedSpanParentId;
    }
  }
}

function isStringOrRegExp(value) {
  return typeof value === 'string' || value instanceof RegExp;
}

export { reparentChildSpans, shouldIgnoreSpan };
//# sourceMappingURL=should-ignore-span.js.map
