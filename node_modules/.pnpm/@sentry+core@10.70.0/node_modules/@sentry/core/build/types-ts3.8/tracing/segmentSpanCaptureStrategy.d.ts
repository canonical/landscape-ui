import { Scope } from '../scope';
import { TransactionEvent } from '../types/event';
import { Span } from '../types/span';
/**
 * Callbacks the deferred-capture strategy hands to `_convertSpanToTransaction` when assembling a
 * transaction. The synchronous (browser) path calls the converter with no options, so neither runs.
 */
export interface SegmentSpanCaptureConvertOptions {
    /** Skip a descendant already sent in an earlier transaction, so it isn't sent twice. */
    isSpanAlreadyCaptured?: (span: Span) => boolean;
    /** Record each span included here, so a child that ends after the snapshot can be emitted as an orphan. */
    onSpanCaptured?: (span: Span) => void;
}
export type SegmentSpanConverter = (options?: SegmentSpanCaptureConvertOptions) => TransactionEvent | undefined;
/**
 * Assembles segment spans into transactions. Registered by SDKs that defer capture (see
 * `_INTERNAL_setDeferSegmentSpanCapture`); when unset, `SentrySpan` captures synchronously. Living
 * behind this seam tree-shakes the deferral machinery out of SDKs that never register one (e.g. browser).
 */
export interface SegmentSpanCaptureStrategy {
    /** Assemble and capture a segment (root or standalone-root) span's transaction through its captured scope. */
    onSegmentSpanEnded(convert: SegmentSpanConverter, scope: Scope): void;
    /** Consider a child that ended after its segment for emission as its own orphan transaction. */
    onChildSpanEnded(span: Span, rootSpan: Span, convert: SegmentSpanConverter, scope: Scope): void;
}
/**
 * @private Private API with no semver guarantees!
 *
 * Set the global segment-span capture strategy (or clear it with `undefined`).
 */
export declare function setSegmentSpanCaptureStrategy(strategy: SegmentSpanCaptureStrategy | undefined): void;
/** Get the global segment-span capture strategy, or `undefined` when none is registered. */
export declare function getSegmentSpanCaptureStrategy(): SegmentSpanCaptureStrategy | undefined;
//# sourceMappingURL=segmentSpanCaptureStrategy.d.ts.map
