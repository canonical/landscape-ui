import type { StreamedSpanJSON } from '@sentry/core';
import type { ReplayContainer } from '../types';
type ProcessSegmentSpanCallback = (spanJSON: StreamedSpanJSON) => void;
export declare function handleProcessSegmentSpan(replay: ReplayContainer): ProcessSegmentSpanCallback;
export {};
//# sourceMappingURL=handleProcessSegmentSpan.d.ts.map