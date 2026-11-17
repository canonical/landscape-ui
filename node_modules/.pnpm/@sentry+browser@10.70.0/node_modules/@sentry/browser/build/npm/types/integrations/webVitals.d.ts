export declare const WEB_VITALS_INTEGRATION_NAME: "WebVitals";
export type WebVitalName = 'cls' | 'inp' | 'lcp';
export interface WebVitalsOptions {
    /**
     * Web vitals to skip.
     */
    ignore?: WebVitalName[];
    /**
     * @experimental
     */
    _experiments?: Partial<{
        enableStandaloneClsSpans: boolean;
        enableStandaloneLcpSpans: boolean;
    }>;
}
/**
 * Captures Core Web Vitals (LCP, CLS, INP) and related pageload vitals.
 *
 * `browserTracingIntegration` auto-registers this integration if no
 * `webVitalsIntegration` is already present, so explicit registration is only
 * needed to customize options or to use it without `browserTracingIntegration`.
 */
export declare const webVitalsIntegration: (options?: WebVitalsOptions | undefined) => import("@sentry/core").Integration & {
    name: "WebVitals";
};
//# sourceMappingURL=webVitals.d.ts.map