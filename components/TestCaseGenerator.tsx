"use client";

import React, { useState } from "react";
import { Braces, Network, Sparkles, AlertCircle } from "lucide-react";

interface TestCaseGeneratorProps {
    type: "array" | "graph";
    algo: string;
    onGenerate: (codeSnippet: string) => void;
}

const TestCaseGenerator: React.FC<TestCaseGeneratorProps> = ({ type, algo, onGenerate }) => {
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
        for (let i = 1; i < size; i++) {
            const parent = nodes[Math.floor(Math.random() * i)];
            const child = nodes[i];
            adj[parent].push(child);
            if (!isDirected) adj[child].push(parent);
        }

        const extraEdges = Math.floor(size * 0.5);
        for (let i = 0; i < extraEdges; i++) {
            const u = nodes[Math.floor(Math.random() * size)];
            const v = nodes[Math.floor(Math.random() * size)];
            if (u !== v && !adj[u].includes(v)) {
                adj[u].push(v);
                if (!isDirected && !adj[v].includes(u)) adj[v].push(u);
            }
        }

        let graphStr = "{\n";
        for (const [node, neighbors] of Object.entries(adj)) {
            graphStr += `    '${node}': ${JSON.stringify(neighbors)},\n`;
        }
        graphStr += "}";

        const funcCall = algo === 'DFS (Graph)' ? "dfs(graph, 'A', set())" : "bfs(graph, 'A')";
        const code = `
# Generated Graph (Nodes: ${size})
graph = ${graphStr}
${funcCall}
`;
        onGenerate(code);
    };

    return (
        <div className="bg-card/40 border-t border-border/60 p-5 space-y-4 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-2 mb-2">
                {type === "array" ? (
                    <div className="p-1.5 bg-blue-500/10 rounded-md">
                        <Braces className="w-4 h-4 text-blue-500" />
                    </div>
                ) : (
                    <div className="p-1.5 bg-purple-500/10 rounded-md">
                        <Network className="w-4 h-4 text-purple-500" />
                    </div>
                )}
                <h3 className="text-sm font-semibold text-foreground tracking-tight">Test Case Generator</h3>
                <div className="ml-auto px-2 py-0.5 bg-secondary rounded text-[10px] font-mono text-muted-foreground border border-border/50">
                    Auto-Insert
                </div>
            </div>

            {type === "array" ? (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Array Size</label>
                        <input
                            type="number"
                            min="1" max="20"
                            value={arraySize}
                            onChange={e => setArraySize(parseInt(e.target.value))}
                            className="w-full bg-background/50 border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Type</label>
                        <select
                            value={arrayType}
                            onChange={(e: any) => setArrayType(e.target.value)}
                            className="w-full bg-background/50 border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none cursor-pointer hover:bg-background"
                        >
                            <option value="sorted">Sorted</option>
                            <option value="random">Random</option>
                        </select>
                    </div>
                    <button
                        onClick={generateArray}
                        className="col-span-2 flex items-center justify-center gap-2 px-4 py-2 mt-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold rounded-md shadow-md shadow-blue-500/10 transition-all active:scale-95"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Generate Array
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Node Count</label>
                        <input
                            type="number"
                            min="2" max="20"
                            value={nodeCount}
                            onChange={e => setNodeCount(parseInt(e.target.value))}
                            className="w-full bg-background/50 border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end">
                        <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-md hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/50">
                            <input
                                type="checkbox"
                                checked={isDirected}
                                onChange={e => setIsDirected(e.target.checked)}
                                className="accent-primary w-3.5 h-3.5"
                            />
                            <span className="text-xs font-medium text-foreground">Directed Graph</span>
                        </label>
                    </div>
                    <button
                        onClick={generateGraph}
                        className="col-span-2 flex items-center justify-center gap-2 px-4 py-2 mt-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-xs font-semibold rounded-md shadow-md shadow-purple-500/10 transition-all active:scale-95"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Generate Graph
                    </button>
                </div>
            )}
        </div>
    );
};

export default TestCaseGenerator;
