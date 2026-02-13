"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, CornerDownRight } from "lucide-react";

interface VisualizerCanvasProps {
    traceStep: any; // The current step data from backend
}

const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({ traceStep }) => {
    if (!traceStep) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                No execution data
            </div>
        );
    }

    const { line, locals, event, func_name } = traceStep;

    // --- Heuristics to detect visualization mode ---
    const isSortingAlgo = func_name && (func_name.includes('sort') || func_name.includes('partition'));
    const isGraphAlgo = (locals && locals.graph) || (func_name && (func_name.includes('dfs') || func_name.includes('bfs')));
    const isDPAlgo = func_name && (func_name.includes('knapsack') || func_name.includes('fibonacci') || locals.dp || locals.memo);
    const isTreeAlgo = locals && locals.root && typeof locals.root === 'object';

    // Binary search fallback
    const isBinarySearch = !isSortingAlgo && !isGraphAlgo && !isDPAlgo && !isTreeAlgo && locals && (locals.arr || locals.weights || locals.prefix || locals.suffix || locals.psum);

    // --- Tree Visualization (BST) ---
    const renderTreeVisualization = () => {
        const root = locals.root;
        if (!root) return null;

        // Traverse to build nodes and edges with layout
        const nodes: any[] = [];
        const edges: any[] = [];

        const traverse = (node: any, x: number, y: number, level: number, parentX?: number, parentY?: number) => {
            if (!node) return;
            // Handle if node is just a reference ID or string (unlikely with our deep copy tracer for simple objects)
            // But if circular, tracer might fail. BST is usually not circular.

            const nodeId = `${x}-${y}-${level}`; // Unique ID based on position/logic
            nodes.push({ id: nodeId, val: node.val, x, y });

            if (parentX !== undefined && parentY !== undefined) {
                edges.push({ x1: parentX, y1: parentY, x2: x, y2: y });
            }

            // Calculate offset based on level to avoid overlap
            // 200 at level 0, 100 at level 1, 50 at level 2...
            const offset = 180 / Math.pow(2, level);

            if (node.left) traverse(node.left, x - offset, y + 60, level + 1, x, y);
            if (node.right) traverse(node.right, x + offset, y + 60, level + 1, x, y);
        };

        // Start traversal from center
        traverse(root, 300, 40, 0);

        return (
            <div className="flex flex-col gap-4 items-center p-4 bg-card/40 rounded-xl border border-border/50 shadow-sm w-max min-w-full h-full">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap sticky left-0">
                    Tree Visualization
                </span>

                <div className="min-w-[600px] min-h-[400px] relative mt-4">
                    <svg width="600" height="500" className="overflow-visible">
                        {/* Edges */}
                        {edges.map((edge, i) => (
                            <motion.line
                                key={`edge-${i}`}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.6 }}
                                x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2}
                                stroke="currentColor"
                                className="text-muted-foreground"
                                strokeWidth="1.5"
                            />
                        ))}

                        {/* Nodes */}
                        {nodes.map((node) => (
                            <g key={node.id}>
                                <motion.circle
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    cx={node.x} cy={node.y} r="18"
                                    fill="rgb(30, 41, 59)"
                                    stroke="rgb(59, 130, 246)"
                                    strokeWidth="2"
                                    className="transition-colors"
                                />
                                <text x={node.x} y={node.y} dy=".3em" textAnchor="middle" className="text-xs font-bold fill-white pointer-events-none">
                                    {node.val}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>
            </div>
        );
    };

    // --- DP Visualization (Grid/Memo) ---
    const renderDPVisualization = () => {
        // Case 1: 2D Grid (Knapsack)
        if (locals.dp && Array.isArray(locals.dp) && Array.isArray(locals.dp[0])) {
            const grid = locals.dp;
            const rows = grid.length;
            const cols = grid[0].length;
            const currentI = locals.i;
            const currentW = locals.w;

            return (
                <div className="flex flex-col gap-4 items-center p-4 bg-card/40 rounded-xl border border-border/50 shadow-sm w-max min-w-full h-full">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap sticky left-0">
                        DP Table (Knapsack)
                    </span>

                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(30px, 1fr))` }}>
                        {/* Header Row (Capacity) */}
                        <div className="w-8 h-8"></div>
                        {Array.from({ length: cols }).map((_, c) => (
                            <div key={`h-${c}`} className="flex items-center justify-center text-[10px] text-muted-foreground font-mono">
                                {c}
                            </div>
                        ))}

                        {grid.map((row: any[], r: number) => (
                            <React.Fragment key={`row-${r}`}>
                                {/* Row Header (Index) */}
                                <div className="flex items-center justify-center text-[10px] text-muted-foreground font-mono w-8">
                                    {r}
                                </div>
                                {row.map((val: any, c: number) => {
                                    const isCurrent = r === currentI && c === currentW;
                                    const isHighlight = r === currentI; // Highlight current processing row

                                    return (
                                        <motion.div
                                            key={`${r}-${c}`}
                                            initial={false}
                                            animate={{
                                                backgroundColor: isCurrent ? "rgb(34, 197, 94)" : isHighlight ? "rgba(255, 255, 255, 0.05)" : "transparent",
                                                color: isCurrent ? "white" : "inherit",
                                                scale: isCurrent ? 1.1 : 1
                                            }}
                                            className={`
                                                w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs font-mono border border-border/30 rounded
                                                ${val !== 0 ? "text-foreground font-semibold" : "text-muted-foreground/30"}
                                            `}
                                        >
                                            {val}
                                        </motion.div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            );
        }

        // Case 2: Memoization (Fibonacci)
        if (locals.memo && typeof locals.memo === 'object') {
            const memo = locals.memo;
            // If stringified by tracer, parse it? Tracer snapshot handles this.
            // It's likely a dict.
            const entries = Object.entries(memo).sort((a, b) => Number(a[0]) - Number(b[0]));
            const currentN = locals.n;

            return (
                <div className="flex flex-col gap-4 items-center p-4 bg-card/40 rounded-xl border border-border/50 shadow-sm w-full h-full">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                        Memoization Table
                    </span>

                    <div className="flex flex-wrap justify-center gap-2">
                        {entries.map(([k, v]) => {
                            const isCurrent = Number(k) === currentN;
                            return (
                                <motion.div
                                    key={k}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1, borderColor: isCurrent ? "rgb(59, 130, 246)" : "rgba(255, 255, 255, 0.1)" }}
                                    className={`
                                        flex flex-col items-center p-2 rounded-lg bg-card border min-w-[50px]
                                        ${isCurrent ? "ring-2 ring-primary bg-primary/10" : ""}
                                    `}
                                >
                                    <span className="text-[10px] text-muted-foreground mb-1">n={k}</span>
                                    <span className="text-lg font-bold font-mono">{String(v)}</span>
                                </motion.div>
                            );
                        })}
                        {entries.length === 0 && (
                            <span className="text-sm text-muted-foreground italic">Empty memo</span>
                        )}
                    </div>
                </div>
            )
        }

        return null;
    };

    // --- Array Visualization (Binary Search) ---
    const renderSortingVisualization = () => {
        const arr = locals.arr;
        if (!Array.isArray(arr)) return null;

        const maxVal = Math.max(...arr, 1);

        // Identify pointers (integer indices)
        const pointers: { [index: number]: { label: string, color: string }[] } = {};
        const colors = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500', 'text-purple-500', 'text-pink-500'];
        let colorIdx = 0;

        Object.entries(locals).forEach(([key, val]) => {
            if (['arr', 'n', 'L', 'R', 'mid'].includes(key)) return; // specific exclusions

            // Checking if value is an integer index within bounds
            if (Number.isInteger(val) && (val as number) >= 0 && (val as number) < arr.length) {
                const idx = val as number;
                if (!pointers[idx]) pointers[idx] = [];
                pointers[idx].push({ label: key, color: colors[colorIdx % colors.length] });
                colorIdx++;
            }
        });

        // Special handling for Merge Sort L/R arrays or pivots if needed?
        // For now, simpler is better: just show the main array and pointers.

        return (
            <div className="flex flex-col gap-6 items-center p-4 bg-card/40 rounded-xl border border-border/50 shadow-sm w-full h-full justify-end">
                <div className="flex items-center gap-2 mb-2 sticky top-0 bg-transparent w-full">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                        Sorting Visualization
                    </span>
                </div>

                <div className="flex items-end justify-center gap-1 w-full h-64 md:h-80 px-4 pb-8">
                    {arr.map((val: any, idx: number) => {
                        const heightPer = Math.max((val / maxVal) * 100, 5);
                        const activePointers = pointers[idx] || [];
                        const isActive = activePointers.length > 0;

                        return (
                            <div key={idx} className="flex flex-col items-center justify-end h-full flex-1 min-w-[12px] max-w-[40px] relative group">
                                {/* Bar */}
                                <motion.div
                                    layout
                                    initial={false}
                                    animate={{
                                        height: `${heightPer}%`,
                                        backgroundColor: isActive ? "rgba(59, 130, 246, 0.8)" : "rgba(59, 130, 246, 0.3)",
                                    }}
                                    className={`w-full rounded-t-sm transition-colors relative border-t border-x border-white/10`}
                                >
                                    {/* Value Label (only if wide enough or hovered) */}
                                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                        {val}
                                    </span>
                                </motion.div>

                                {/* Index */}
                                <span className="text-[9px] font-mono text-muted-foreground/40 mt-1">{idx}</span>

                                {/* Pointers Labels */}
                                {activePointers.length > 0 && (
                                    <div className="absolute -bottom-8 flex flex-col items-center z-10">
                                        {activePointers.map((p, pIdx) => (
                                            <motion.div
                                                key={p.label}
                                                layoutId={`pointer-${p.label}`}
                                                className={`text-[10px] font-bold ${p.color} whitespace-nowrap leading-none mb-0.5`}
                                            >
                                                {p.label}
                                                {pIdx < activePointers.length - 1 && ","}
                                            </motion.div>
                                        ))}
                                        <div className="w-0.5 h-2 bg-foreground/20 rounded-full mt-0.5" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // --- Array Visualization (Binary Search) ---
    const renderArrayVisualization = () => {
        // Detect arrays to visualize
        const candidates = [
            { key: 'arr', label: 'Input Array' },
            { key: 'weights', label: 'Weights' },
            { key: 'prefix', label: 'Prefix Sum' },
            { key: 'suffix', label: 'Suffix Sum' },
            { key: 'psum', label: 'Prefix Sum' }
        ];

        // Helper to parse if string
        const parseArray = (val: any) => {
            if (Array.isArray(val)) return val;
            if (typeof val === 'string') {
                try {
                    const parsed = JSON.parse(val);
                    if (Array.isArray(parsed)) return parsed;
                } catch (e) { }
            }
            return null;
        };

        const arraysToRender = candidates
            .map(c => ({ ...c, data: parseArray(locals[c.key]) }))
            .filter(c => c.data !== null);

        // Common pointers
        const left = locals.left ?? locals.low ?? locals.L;
        const right = locals.right ?? locals.high ?? locals.R;
        const mid = locals.mid;
        const target = locals.target;
        const ans = locals.ans ?? locals.min_capacity;

        // Special Case: Binary Search on Answer (Search Space is NOT the array indices)
        // If we have 'weights' and 'days', we are likely in BS Answer.
        // We want to visualize the NUMBER LINE for [left, right] if they exist.
        const isBSAnswer = locals.weights && locals.days !== undefined && left !== undefined && right !== undefined;

        // If no arrays found and not BS Answer, return null
        if (arraysToRender.length === 0 && !isBSAnswer) return null;

        return (
            <div className="flex flex-col gap-6 items-center p-2 md:p-4 bg-card/40 rounded-xl border border-border/50 shadow-sm w-max min-w-full">
                <div className="flex items-center gap-2 mb-2 sticky left-0 shrink-0">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                        {isBSAnswer ? "Binary Search on Answer" : "Array Visualization"}
                    </span>
                    {target !== undefined && <span className="text-[10px] sm:text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20 whitespace-nowrap">Target: {target}</span>}
                    {ans !== undefined && <span className="text-[10px] sm:text-xs bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded border border-green-500/20 whitespace-nowrap">Ans: {ans}</span>}
                </div>

                {/* BS Answer Search Space Visualization */}
                {isBSAnswer && (
                    <div className="flex flex-col items-center gap-2 w-full px-4 md:px-8 py-4 bg-background/50 rounded-lg border border-border/50 mb-4 min-w-[300px]">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Search Space (Capacity)</span>
                        <div className="relative w-full h-12 flex items-center">
                            {/* Number Line Track */}
                            <div className="w-full h-1 bg-border rounded-full relative">
                                {/* Range Highlight */}
                                <motion.div
                                    className="absolute h-full bg-blue-500/30"
                                    layout
                                    initial={false}
                                    animate={{
                                        left: "0%",
                                        width: "100%"
                                        // Logic is tricky without fixed scale.
                                        // Simplified: Just show L, R, Mid textually on a bar?
                                        // Or just show 3 labeled points if range is huge.
                                    }}
                                />
                            </div>

                            {/* Pointers on the abstract line */}
                            <div className="flex justify-between w-full absolute top-0 text-xs font-mono">
                                <div className="flex flex-col items-center -ml-3">
                                    <span className="mb-1 text-yellow-500 font-bold">L</span>
                                    <span className="text-foreground">{left}</span>
                                </div>

                                {mid !== undefined && (
                                    <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
                                        <span className="mb-1 text-blue-500 font-bold">Mid</span>
                                        <span className="text-foreground">{mid}</span>
                                    </div>
                                )}

                                <div className="flex flex-col items-center -mr-3">
                                    <span className="mb-1 text-yellow-500 font-bold">R</span>
                                    <span className="text-foreground">{right}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-6 md:gap-8 w-full min-w-max px-2">
                    {arraysToRender.map((config, rowIdx) => {
                        const arr = config.data as any[];
                        // For BS Answer, we don't show L/R pointers on the 'weights' array
                        // because L/R refer to capacity, not index.
                        const showPointers = !isBSAnswer;

                        return (
                            <div key={config.key} className="flex flex-col gap-2 relative px-4">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground sticky left-4">{config.label}</span>
                                <div className="flex gap-1">
                                    {arr.map((val: any, idx: number) => {
                                        // Pointers logic 
                                        const isLeft = showPointers && idx === left;
                                        const isRight = showPointers && idx === right;
                                        const isMid = showPointers && idx === mid;

                                        // Highlight logic
                                        const inRange = showPointers ? ((left !== undefined && right !== undefined) ? (idx >= left && idx <= right) : true) : true;
                                        const isFound = val === target && (isMid || (!mid && inRange));

                                        return (
                                            <div key={idx} className="flex flex-col items-center gap-1 relative group min-w-[40px]">
                                                {/* Value Box */}
                                                <motion.div
                                                    layout
                                                    initial={false}
                                                    animate={{
                                                        scale: isMid ? 1.1 : 1,
                                                        backgroundColor: isFound ? "rgba(34, 197, 94, 0.6)" : isMid ? "rgba(59, 130, 246, 0.6)" : inRange ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)",
                                                        borderColor: isFound ? "rgb(34, 197, 94)" : isMid ? "rgb(59, 130, 246)" : inRange ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                                                        opacity: inRange ? 1 : 0.4
                                                    }}
                                                    className={`w-10 h-10 flex items-center justify-center rounded border-2 text-sm font-bold font-mono transition-colors border-border text-white shadow-sm font-bold`}
                                                >
                                                    {val}
                                                </motion.div>

                                                {/* Index */}
                                                <span className={`text-[10px] font-mono ${inRange ? "text-muted-foreground" : "text-muted-foreground/30"}`}>{idx}</span>

                                                {/* Pointers */}
                                                {showPointers && (
                                                    <>
                                                        <div className="absolute -top-6 w-full flex justify-center h-4">
                                                            {isLeft && (
                                                                <motion.div layoutId={`pointer-left-${rowIdx}`} className="text-[10px] font-bold text-yellow-500 flex flex-col items-center absolute bottom-0">
                                                                    <span className="leading-none mb-0.5">L</span>
                                                                    <div className="w-0.5 h-2 bg-yellow-500 rounded-full" />
                                                                </motion.div>
                                                            )}
                                                            {isRight && !isLeft && (
                                                                <motion.div layoutId={`pointer-right-${rowIdx}`} className="text-[10px] font-bold text-yellow-500 flex flex-col items-center absolute bottom-0">
                                                                    <span className="leading-none mb-0.5">R</span>
                                                                    <div className="w-0.5 h-2 bg-yellow-500 rounded-full" />
                                                                </motion.div>
                                                            )}
                                                            {isRight && isLeft && (
                                                                <motion.div layoutId={`pointer-lr-${rowIdx}`} className="text-[10px] font-bold text-yellow-500 flex flex-col items-center absolute bottom-0">
                                                                    <span className="leading-none mb-0.5">L/R</span>
                                                                    <div className="w-0.5 h-2 bg-yellow-500 rounded-full" />
                                                                </motion.div>
                                                            )}
                                                        </div>

                                                        <div className="absolute -bottom-8 w-full flex justify-center h-4">
                                                            {isMid && (
                                                                <motion.div layoutId={`pointer-mid-${rowIdx}`} className="text-xs font-bold text-blue-500 flex flex-col items-center absolute top-0">
                                                                    <ArrowUp className="w-4 h-4" />
                                                                    <span className="leading-none">mid</span>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // --- Graph Visualization (DFS/BFS) ---
    const renderGraphVisualization = () => {
        const graph = locals.graph || {};
        const visited = locals.visited; // might be list or set (rendered as dict or list in json)
        // Set needs parsing if it came as string representation or array
        let visitedSet = new Set();
        if (Array.isArray(visited)) {
            visited.forEach((v: any) => visitedSet.add(v));
        } else if (typeof visited === 'string') {
            // Primitive parsing if simple set string "{'A', 'B'}"
            visited.replace(/[{'}\s]/g, '').split(',').forEach(v => visitedSet.add(v));
        }

        const currentNode = locals.node || locals.start || locals.curr; // Heuristic for current node

        // Generate Layout
        const nodes = Object.keys(graph).sort();
        if (nodes.length === 0) return null;

        // Circular Layout
        const radius = 120;
        const centerX = 150;
        const centerY = 150;
        const nodePositions: Record<string, { x: number, y: number }> = {};

        nodes.forEach((node, i) => {
            const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2; // Start from top
            nodePositions[node] = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        });

        // Determine if directed: check if edges are bidirectional
        // Simple visual heuristic: always draw arrowheads for clarity in traversal

        return (
            <div className="flex flex-col gap-4 items-center p-4 bg-card/40 rounded-xl border border-border/50 shadow-sm w-full">
                <div className="flex items-center gap-2 mb-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Graph Visualization ({func_name})</span>
                </div>

                <svg width="300" height="300" className="overflow-visible">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                        </marker>
                    </defs>

                    {/* Edges */}
                    {nodes.map(node => {
                        const neighbors = graph[node] || [];
                        const { x: x1, y: y1 } = nodePositions[node];
                        return neighbors.map((neighbor: string) => {
                            if (!nodePositions[neighbor]) return null;
                            // Avoid double drawing for undirected if we iterate all.
                            // But actually drawing twice overlapping is fine for simple visualizer.
                            const { x: x2, y: y2 } = nodePositions[neighbor];
                            return (
                                <motion.line
                                    key={`${node}-${neighbor}`}
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.5 }}
                                    x1={x1} y1={y1} x2={x2} y2={y2}
                                    stroke="currentColor"
                                    className="text-slate-500"
                                    strokeWidth="1.5"
                                    markerEnd="url(#arrowhead)"
                                />
                            );
                        });
                    })}

                    {/* Nodes */}
                    {nodes.map(node => {
                        const { x, y } = nodePositions[node];
                        const isVisited = visitedSet.has(node);
                        const isCurrent = node === currentNode;

                        return (
                            <g key={node}>
                                <motion.circle
                                    initial={{ scale: 0 }}
                                    animate={{
                                        scale: 1,
                                        fill: isCurrent ? "rgb(59, 130, 246)" : isVisited ? "rgb(34, 197, 94)" : "rgb(30, 41, 59)",
                                        stroke: isCurrent ? "white" : isVisited ? "rgb(34, 197, 94)" : "rgb(71, 85, 105)"
                                    }}
                                    cx={x} cy={y} r="18"
                                    strokeWidth="2"
                                    className="transition-colors duration-300"
                                />
                                <text x={x} y={y} dy=".3em" textAnchor="middle" className="text-xs font-bold fill-white pointer-events-none">
                                    {node}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                <div className="flex gap-4 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-600"></div> Unvisited</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Visited</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Current</div>
                </div>
            </div>
        );
    };


    // --- Generic Variable Rendering (Fallback & Locals) ---
    const renderValue = (key: string, value: any) => {
        // Skip variables that are already visualized in the main view to reduce clutter
        if (isBinarySearch && ['arr', 'left', 'right', 'mid', 'low', 'high', 'weights', 'days', 'target', 'ans', 'min_capacity', 'prefix', 'suffix', 'psum'].includes(key)) return null;
        if (isGraphAlgo && ['graph', 'visited'].includes(key)) return null;

        let parsedValue = value;
        try {
            if (typeof value === 'string') {
                if ((value.startsWith('[') && value.endsWith(']')) || (value.startsWith('{') && value.endsWith('}'))) {
                    parsedValue = JSON.parse(value);
                }
            }
        } catch (e) { /* ignore */ }

        if (Array.isArray(parsedValue)) {
            return (
                <div className="flex flex-wrap gap-1">
                    {parsedValue.map((item, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-secondary rounded text-[10px] border border-border">{String(item)}</span>
                    ))}
                </div>
            )
        }

        return <span className="text-foreground font-mono text-xs font-medium">{String(value)}</span>;
    };

    return (
        <div className="w-full h-full flex flex-col gap-4 p-4 pb-8 overflow-scroll custom-scrollbar">
            {/* Function Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                <span className="px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20 text-xs font-mono">
                    {func_name || 'main'}
                </span>
                <span className="text-xs">Line: {line}</span>
                <span className="uppercase text-[10px] tracking-wider border px-1 rounded ml-auto">{event}</span>
            </div>

            {/* Main Visualization Area */}
            {isTreeAlgo && renderTreeVisualization()}
            {isDPAlgo && renderDPVisualization()}
            {isSortingAlgo && renderSortingVisualization()}
            {isBinarySearch && renderArrayVisualization()}
            {isGraphAlgo && renderGraphVisualization()}

            {/* Variable Watch (Secondary) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 shrink-0">
                <AnimatePresence>
                    {Object.entries(locals || {}).map(([key, value]) => {
                        const content = renderValue(key, value);
                        if (!content) return null; // Skip if handled by visualizer or hidden

                        return (
                            <motion.div
                                key={key}
                                layout
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-card/30 border border-border/40 rounded-lg p-3 backdrop-blur-sm flex flex-col gap-1"
                            >
                                <span className="font-mono text-xs text-muted-foreground font-semibold line-clamp-1">{key}</span>
                                <div className="w-full">{content}</div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default VisualizerCanvas;
