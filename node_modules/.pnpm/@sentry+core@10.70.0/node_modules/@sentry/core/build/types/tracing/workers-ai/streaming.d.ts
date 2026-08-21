import type { Span } from '../../types/span';
/**
 * Wrap a Workers AI streaming response (a server-sent-events `ReadableStream`) so we can
 * accumulate the response text and token usage while passing the original bytes through untouched.
 *
 * The span is ended once the consumer finishes reading (or cancels) the stream.
 */
export declare function instrumentWorkersAiStream(stream: ReadableStream<Uint8Array>, span: Span, recordOutputs: boolean): ReadableStream<Uint8Array>;
//# sourceMappingURL=streaming.d.ts.map