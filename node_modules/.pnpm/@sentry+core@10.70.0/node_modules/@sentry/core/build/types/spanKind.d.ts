/**
 * The kind of a span, mirroring OpenTelemetry's `SpanKind` enum values.
 *
 * Exported as a plain const object so SDK code can set a span's kind without
 * importing `@opentelemetry/api` just for the enum. The numeric values must
 * stay in sync with OpenTelemetry's `SpanKind` since they are passed through to
 * the underlying OTel span and sampler.
 */
export declare const SPAN_KIND: {
    readonly INTERNAL: 0;
    readonly SERVER: 1;
    readonly CLIENT: 2;
    readonly PRODUCER: 3;
    readonly CONSUMER: 4;
};
export type SpanKindValue = (typeof SPAN_KIND)[keyof typeof SPAN_KIND];
declare const SPAN_KIND_NAME: {
    readonly 0: "INTERNAL";
    readonly 1: "SERVER";
    readonly 2: "CLIENT";
    readonly 3: "PRODUCER";
    readonly 4: "CONSUMER";
};
/**
 * Resolve the string name of a span kind value (e.g. `1` → `'SERVER'`), mirroring the reverse
 * mapping of OpenTelemetry's `SpanKind` enum. Used for the `otel.kind` span attribute, so SDK
 * code doesn't need to import `@opentelemetry/api` just for that reverse lookup.
 */
export declare function spanKindToName(kind: number): (typeof SPAN_KIND_NAME)[SpanKindValue] | undefined;
export {};
//# sourceMappingURL=spanKind.d.ts.map