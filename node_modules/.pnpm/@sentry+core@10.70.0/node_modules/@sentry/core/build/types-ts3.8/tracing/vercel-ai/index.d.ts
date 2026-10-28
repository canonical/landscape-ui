import { Client } from '../../client';
/**
 * Post-process spans emitted by the Vercel AI SDK.
 */
/**
 * Rename and normalize Vercel AI SDK attributes to OpenTelemetry semantic conventions.
 * This is the shared attribute processing logic used by both the legacy event processor
 * path (SpanJSON) and the streamed span path (StreamedSpanJSON).
 */
export declare function processVercelAiSpanAttributes(attributes: Record<string, unknown>): void;
/**
 * Add event processors to the given client to process Vercel AI spans.
 */
export declare function addVercelAiProcessors(client: Client): void;
/**
 * Derive the `gen_ai.usage.*` cache/reasoning/prediction token attributes and `gen_ai.conversation.id`
 * from an AI SDK `providerMetadata` object.
 *
 * Shared between the OTel processor (which parses `providerMetadata` from a serialized span attribute)
 * and the `ai` >= 7 tracing-channel subscriber (which receives it as an object on the channel result),
 * so both paths emit an identical shape. Pass the already-parsed object; unknown/empty input yields `{}`.
 */
export declare function getProviderMetadataAttributes(providerMetadata: unknown): Record<string, number | string>;
//# sourceMappingURL=index.d.ts.map
