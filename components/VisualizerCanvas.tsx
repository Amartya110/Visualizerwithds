"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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

    // Helper to render value based on type
    const renderValue = (key: string, value: any) => {
        // Try to parse if it's a stringified JSON
        let parsedValue = value;
        try {
            if (typeof value === 'string') {
                // Basic heuristic to check if it looks like JSON structure
                if ((value.startsWith('[') && value.endsWith(']')) || (value.startsWith('{') && value.endsWith('}'))) {
                    parsedValue = JSON.parse(value);
                }
            }
        } catch (e) {
            // ignore
        }

        if (Array.isArray(parsedValue)) {
            return (
                <div className="flex flex-col gap-1 w-full">
                    <div className="flex gap-1 overflow-x-auto p-2 bg-card/50 rounded-md border border-border/50 max-w-full custom-scrollbar">
                        {parsedValue.map((item, idx) => (
                            <motion.div
                                key={`${key}-${idx}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="min-w-[32px] h-8 flex items-center justify-center bg-secondary rounded text-xs font-mono border border-border shrink-0 hover:bg-primary/20 transition-colors cursor-default relative group"
                            >
                                {String(item)}
                                <span className="absolute -bottom-3 text-[8px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">{idx}</span>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-[10px] text-muted-foreground text-right px-1">Size: {parsedValue.length}</div>
                </div>
            );
        }

        if (typeof parsedValue === 'object' && parsedValue !== null) {
            // Heuristic: Check if this looks like a graph adjacency list (Dict[str, List])
            const keys = Object.keys(parsedValue);
            const isGraph = keys.length > 0 && keys.every(k => Array.isArray(parsedValue[k]));

            if (isGraph) {
                return (
                    <div className="flex flex-col gap-2 bg-card/50 p-3 rounded-md border border-border/50 max-h-[300px] overflow-y-auto custom-scrollbar">
                        <div className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wider">Adjacency List</div>
                        {keys.map((node) => (
                            <div key={node} className="flex items-center gap-2">
                                {/* Node */}
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs shrink-0 shadow-lg shadow-primary/20">
                                    {node}
                                </div>
                                {/* Arrow */}
                                <div className="text-muted-foreground text-xs">→</div>
                                {/* Neighbors */}
                                <div className="flex gap-1 flex-wrap">
                                    {parsedValue[node].length > 0 ? (
                                        parsedValue[node].map((neighbor: any, idx: number) => (
                                            <div key={idx} className="px-2 py-1 rounded bg-secondary text-[10px] border border-border">
                                                {String(neighbor)}
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-[10px] text-muted-foreground italic">No neighbors</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }

            return (
                <pre className="text-xs bg-card/50 p-2 rounded overflow-auto max-h-[100px] custom-scrollbar">
                    {JSON.stringify(parsedValue, null, 2)}
                </pre>
            )
        }

        return <span className="text-accent font-mono">{String(value)}</span>;
    };

    return (
        <div className="w-full h-full flex flex-col gap-4 p-4 overflow-y-auto">
            {/* Function Stack / Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span className="px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                    {func_name || 'main'}
                </span>
                <span>Line: {line}</span>
                <span className="uppercase text-[10px] tracking-wider border px-1 rounded">{event}</span>
            </div>

            {/* Variables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {Object.entries(locals || {}).map(([key, value]) => (
                        <motion.div
                            key={key}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-card/40 border border-border/40 rounded-lg p-4 backdrop-blur-sm hover:border-primary/30 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-sm text-muted-foreground font-semibold">{key}</span>
                                <span className="text-[10px] text-muted-foreground/50">{typeof value}</span>
                            </div>
                            <div className="mt-1">
                                {renderValue(key, value)}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default VisualizerCanvas;
