type ReportTypes = 'crash' | 'deprecation' | 'intervention';
interface ReportingObserverOptions {
    types?: ReportTypes[];
}
/**
 * Reporting API integration - https://w3c.github.io/reporting/
 */
export declare const reportingObserverIntegration: (options?: ReportingObserverOptions | undefined) => import("@sentry/core").Integration & {
    name: "ReportingObserver";
};
export {};
//# sourceMappingURL=reportingobserver.d.ts.map