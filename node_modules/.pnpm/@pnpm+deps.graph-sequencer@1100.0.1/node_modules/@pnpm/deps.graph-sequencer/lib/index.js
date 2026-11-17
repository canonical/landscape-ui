/**
 * Performs topological sorting on a graph while supporting node restrictions.
 *
 * @param {Graph<T>}  graph - The graph represented as a Map where keys are nodes and values are their outgoing edges.
 * @param {T[]} includedNodes - An array of nodes that should be included in the sorting process. Other nodes will be ignored.
 * @returns {Result<T>} An object containing the result of the sorting, including safe, chunks, and cycles.
 */
export function graphSequencer(graph, includedNodes = [...graph.keys()]) {
    // Initialize reverseGraph with empty arrays for all nodes.
    const reverseGraph = new Map();
    for (const key of graph.keys()) {
        reverseGraph.set(key, []);
    }
    // Calculate outDegree and reverseGraph for the included nodes.
    const nodes = new Set(includedNodes);
    const visited = new Set();
    const outDegree = new Map();
    for (const [from, edges] of graph.entries()) {
        outDegree.set(from, 0);
        for (const to of edges) {
            if (nodes.has(from) && nodes.has(to)) {
                changeOutDegree(from, 1);
                reverseGraph.get(to).push(from);
            }
        }
        if (!nodes.has(from)) {
            visited.add(from);
        }
    }
    const chunks = [];
    const cycles = [];
    let safe = true;
    while (nodes.size) {
        const chunk = [];
        let minDegree = Number.MAX_SAFE_INTEGER;
        for (const node of nodes) {
            const degree = outDegree.get(node);
            if (degree === 0) {
                chunk.push(node);
            }
            minDegree = Math.min(minDegree, degree);
        }
        if (minDegree === 0) {
            chunk.forEach(removeNode);
            chunks.push(chunk);
        }
        else {
            const cycleNodes = [];
            for (const node of nodes) {
                const cycle = findCycle(node);
                if (cycle.length) {
                    cycles.push(cycle);
                    cycle.forEach(removeNode);
                    cycleNodes.push(...cycle);
                    if (cycle.length > 1) {
                        safe = false;
                    }
                }
            }
            chunks.push(cycleNodes);
        }
    }
    return { safe, chunks, cycles };
    // Function to update the outDegree of a node.
    function changeOutDegree(node, value) {
        const degree = outDegree.get(node) ?? 0;
        outDegree.set(node, degree + value);
    }
    // Function to remove a node from the graph.
    function removeNode(node) {
        for (const from of reverseGraph.get(node)) {
            changeOutDegree(from, -1);
        }
        visited.add(node);
        nodes.delete(node);
    }
    function findCycle(startNode) {
        const queue = [[startNode, [startNode]]];
        const cycleVisited = new Set();
        const cycles = [];
        while (queue.length) {
            const [id, cycle] = queue.shift();
            for (const to of graph.get(id)) {
                if (to === startNode) {
                    cycleVisited.add(to);
                    cycles.push([...cycle]);
                    continue;
                }
                if (visited.has(to) || cycleVisited.has(to)) {
                    continue;
                }
                cycleVisited.add(to);
                queue.push([to, [...cycle, to]]);
            }
        }
        if (!cycles.length) {
            return [];
        }
        cycles.sort((a, b) => b.length - a.length);
        return cycles[0];
    }
}
//# sourceMappingURL=index.js.map