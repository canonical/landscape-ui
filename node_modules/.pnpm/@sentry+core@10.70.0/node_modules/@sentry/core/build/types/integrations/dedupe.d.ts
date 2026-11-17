import type { Event } from '../types/event';
/**
 * Deduplication filter.
 */
export declare const dedupeIntegration: () => import("..").Integration & {
    name: "Dedupe";
};
/** only exported for tests. */
export declare function _shouldDropEvent(currentEvent: Event, previousEvent?: Event): boolean;
//# sourceMappingURL=dedupe.d.ts.map