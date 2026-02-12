"use client";

import React, { useState } from "react";

interface TestCaseGeneratorProps {
    type: "array" | "graph";
    onGenerate: (codeSnippet: string) => void;
}

const TestCaseGenerator: React.FC<TestCaseGeneratorProps> = ({ type, onGenerate }) => {
    // Array State
    const [arraySize, setArraySize] = useState(10);
    const [arrayType, setArrayType] = useState<"sorted" | "random">("sorted");

    // Graph State
    const [nodeCount, setNodeCount] = useState(6);
    const [isDirected, setIsDirected] = useState(false);

    const generateArray = () => {
        const size = Math.min(Math.max(1, arraySize), 20); // Clamp between 1 and 20
        let arr = [];
        if (arrayType === "sorted") {
            for (let i = 0; i < size; i++) arr.push(i * 2 + 1);
        } else {
            for (let i = 0; i < size; i++) arr.push(Math.floor(Math.random() * 100));
        }

        // Generate Python code for verification
        const code = `
# Generated Test Case (Size: ${size})
arr = ${JSON.stringify(arr)}
target = ${arr[Math.floor(Math.random() * arr.length)]}
result = binary_search(arr, target)
print(f"Index of {target}: {result}")
`;
        onGenerate(code);
    };

    const generateGraph = () => {
        const size = Math.min(Math.max(1, nodeCount), 20);
        const nodes = Array.from({ length: size }, (_, i) => String.fromCharCode(65 + i)); // A, B, C...
        const adj: Record<string, string[]> = {};

        nodes.forEach(n => adj[n] = []);

        // Create a random connected graph (spanning tree + extra edges)
        // 1. Spanning tree to ensure connectivity (mostly)
        for (let i = 1; i < size; i++) {
            const parent = nodes[Math.floor(Math.random() * i)];
            const child = nodes[i];
            adj[parent].push(child);
            if (!isDirected) adj[child].push(parent);
        }

        // 2. Extra edges
        const extraEdges = Math.floor(size * 0.5);
        for (let i = 0; i < extraEdges; i++) {
            const u = nodes[Math.floor(Math.random() * size)];
            const v = nodes[Math.floor(Math.random() * size)];
            if (u !== v && !adj[u].includes(v)) {
                adj[u].push(v);
                if (!isDirected && !adj[v].includes(u)) adj[v].push(u);
            }
        }

        // Format as Python dictionary string
        let graphStr = "{\n";
        for (const [node, neighbors] of Object.entries(adj)) {
            graphStr += `    '${node}': ${JSON.stringify(neighbors)},\n`;
        }
        graphStr += "}";

        const funcCall = type === 'graph' ? "dfs(graph, 'A', set())" : "bfs(graph, 'A')";
        const code = `
# Generated Graph (Nodes: ${size})
graph = ${graphStr}
${funcCall}
`;
        onGenerate(code);
    };

    if (type === "array") {
        return (
            <div className="p-4 bg-card/30 border-t border-border/40 space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Generate Test Case</h3>
                <div className="flex gap-4 items-center">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-muted-foreground">Size (Max 20)</label>
                        <input
                            type="number"
                            min="1" max="20"
                            value={arraySize}
                            onChange={e => setArraySize(parseInt(e.target.value))}
                            className="w-16 bg-background border border-border rounded px-2 py-1 text-xs"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-muted-foreground">Type</label>
                        <select
                            value={arrayType}
                            onChange={(e: any) => setArrayType(e.target.value)}
                            className="bg-background border border-border rounded px-2 py-1 text-xs"
                        >
                            <option value="sorted">Sorted</option>
                            <option value="random">Random</option>
                        </select>
                    </div>
                    <button
                        onClick={generateArray}
                        className="mt-auto px-3 py-1 bg-secondary hover:bg-secondary/80 text-xs rounded border border-border transition-colors"
                    >
                        Generate
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-card/30 border-t border-border/40 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Generate Graph</h3>
            <div className="flex gap-4 items-center">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-muted-foreground">Nodes (Max 20)</label>
                    <input
                        type="number"
                        min="2" max="20"
                        value={nodeCount}
                        onChange={e => setNodeCount(parseInt(e.target.value))}
                        className="w-16 bg-background border border-border rounded px-2 py-1 text-xs"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-muted-foreground">Type</label>
                    <div className="flex items-center gap-2 h-[26px]">
                        <label className="text-xs flex items-center gap-1 cursor-pointer">
                            <input type="checkbox" checked={isDirected} onChange={e => setIsDirected(e.target.checked)} />
                            Directed
                        </label>
                    </div>
                </div>
                <button
                    onClick={generateGraph}
                    className="mt-auto px-3 py-1 bg-secondary hover:bg-secondary/80 text-xs rounded border border-border transition-colors"
                >
                    Generate
                </button>
            </div>
        </div>
    );
};

export default TestCaseGenerator;
