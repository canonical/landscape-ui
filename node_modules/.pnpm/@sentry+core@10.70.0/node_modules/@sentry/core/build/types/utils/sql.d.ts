/**
 * Derives a low-cardinality summary from a SQL query for use as `db.query.summary`.
 *
 * Conforms to the OTEL semantic convention for generating query summaries:
 * - Preserves original case of operations and identifiers (no normalization)
 * - Uses format: `{operation} {target1} {target2} ...`
 * - Strips filler words (INTO, FROM) from the operation
 * - Captures multiple table targets (JOINs)
 * - Handles INSERT...SELECT with both targets
 * - Truncates to 255 characters without splitting mid-value
 *
 * @see https://opentelemetry.io/docs/specs/semconv/database/database-spans/#generating-a-summary-of-the-query
 */
export declare function getSqlQuerySummary(query: string | undefined): string | undefined;
//# sourceMappingURL=sql.d.ts.map