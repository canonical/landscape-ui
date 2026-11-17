import type { CollectBehavior } from '../../types/datacollection';
/**
 * Filters a key-value record according to a `CollectBehavior`.
 *
 * Key names are always preserved. Values are either kept, replaced with
 * `[Filtered]`, or the entire record is dropped (off mode).
 *
 * @param additionalDenyTerms - Additional sensitive snippets to check beyond the built-in denylist.
 */
export declare function filterKeyValueData<T>(data: Record<string, T>, behavior: CollectBehavior, additionalDenyTerms?: string[]): Record<string, T | string>;
//# sourceMappingURL=filterKeyValueData.d.ts.map