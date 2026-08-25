/**
 * Patch toString calls to return proper name for wrapped functions.
 *
 * ```js
 * Sentry.init({
 *   integrations: [
 *     functionToStringIntegration(),
 *   ],
 * });
 * ```
 */
export declare const functionToStringIntegration: () => import("..").Integration & {
    name: "FunctionToString";
};
//# sourceMappingURL=functiontostring.d.ts.map