import type { SpanAttributeValue } from '../../types/span';
import type { BaseChatModel } from '../langchain/types';
import type { CompiledGraph, LangGraphOptions } from './types';
/**
 * Builds the span options for a LangGraph `create_agent` span.
 *
 * @internal Exported so the diagnostics-channel (orchestrion) instrumentation can open the same span
 * as the prototype-patching path below without re-declaring the semantic attribute keys.
 */
export declare function _INTERNAL_getLangGraphCreateAgentSpanOptions(agentName?: string): {
    op: string;
    name: string;
    attributes: Record<string, SpanAttributeValue>;
};
/**
 * Instruments StateGraph's compile method to create spans for agent creation and invocation
 *
 * Wraps the compile() method to:
 * - Create a `gen_ai.create_agent` span when compile() is called
 * - Automatically wrap the invoke() method on the returned compiled graph with a `gen_ai.invoke_agent` span
 *
 */
export declare function instrumentStateGraphCompile(originalCompile: (...args: unknown[]) => CompiledGraph, options: LangGraphOptions): (...args: unknown[]) => CompiledGraph;
/**
 * Instruments CompiledGraph's invoke method to create spans for agent invocation
 *
 * Creates a `gen_ai.invoke_agent` span when invoke() is called
 */
export declare function instrumentCompiledGraphInvoke(originalInvoke: (...args: unknown[]) => Promise<unknown>, graphInstance: CompiledGraph, compileOptions: Record<string, unknown>, options: LangGraphOptions, llm?: BaseChatModel | null, sentryCallbackHandler?: unknown): (...args: unknown[]) => Promise<unknown>;
/**
 * Instruments createReactAgent to create invoke_agent and execute_tool spans.
 */
export declare function instrumentCreateReactAgent(originalCreateReactAgent: (...args: unknown[]) => CompiledGraph, options?: LangGraphOptions): (...args: unknown[]) => CompiledGraph;
/**
 * Directly instruments a StateGraph instance to add tracing spans
 *
 * This function can be used to manually instrument LangGraph StateGraph instances
 * in environments where automatic instrumentation is not available or desired.
 *
 * @param stateGraph - The StateGraph instance to instrument
 * @param options - Optional configuration for recording inputs/outputs
 *
 * @example
 * ```typescript
 * import { instrumentStateGraph } from '@sentry/cloudflare';
 * import { StateGraph } from '@langchain/langgraph';
 *
 * const graph = new StateGraph(MessagesAnnotation)
 *   .addNode('agent', mockLlm)
 *   .addEdge(START, 'agent')
 *   .addEdge('agent', END);
 *
 * instrumentStateGraph(graph, { recordInputs: true, recordOutputs: true });
 * const compiled = graph.compile({ name: 'my_agent' });
 * ```
 */
export declare function instrumentStateGraph<T extends {
    compile: (...args: any[]) => any;
}>(stateGraph: T, options?: LangGraphOptions): T;
/**
 * Directly instruments a StateGraph instance to add tracing spans.
 *
 * @deprecated This function was renamed and will be removed in a future major version.
 * Use `instrumentStateGraph` instead.
 */
export declare const instrumentLangGraph: typeof instrumentStateGraph;
//# sourceMappingURL=index.d.ts.map