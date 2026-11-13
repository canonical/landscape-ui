/**
 *
 * @param urlOrPath - The URL or path to convert to an absolute URL.
 *
 * @return the absolute URL when handed a relative URL path, by
 * combining the current `window.location.origin` with param urlOrPath.
 *
 * If param urlOrPath is already a full or an invalid URL,
 * or URL determination fails, the original param urlOrPath is returned unchanged.
 *
 */
export declare function getAbsoluteUrl(urlOrPath: string): string;
//# sourceMappingURL=location.d.ts.map
