interface BreadcrumbsOptions {
    console: boolean;
    dom: boolean | {
        serializeAttribute?: string | string[];
        maxStringLength?: number;
    };
    fetch: boolean;
    history: boolean;
    sentry: boolean;
    xhr: boolean;
}
export declare const breadcrumbsIntegration: (options?: Partial<BreadcrumbsOptions> | undefined) => import("@sentry/core").Integration & {
    name: "Breadcrumbs";
};
export {};
//# sourceMappingURL=breadcrumbs.d.ts.map