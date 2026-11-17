export type Graph<T> = Map<T, T[]>;
export type Groups<T> = T[][];
export interface Options<T> {
    graph: Graph<T>;
    groups: Groups<T>;
}
export interface Result<T> {
    safe: boolean;
    chunks: Groups<T>;
    cycles: Groups<T>;
}
/**
 * Performs topological sorting on a graph while supporting node restrictions.
 *
 * @param {Graph<T>}  graph - The graph represented as a Map where keys are nodes and values are their outgoing edges.
 * @param {T[]} includedNodes - An array of nodes that should be included in the sorting process. Other nodes will be ignored.
 * @returns {Result<T>} An object containing the result of the sorting, including safe, chunks, and cycles.
 */
export declare function graphSequencer<T>(graph: Graph<T>, includedNodes?: T[]): Result<T>;
