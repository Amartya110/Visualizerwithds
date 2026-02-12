"use client";

import React from "react";
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";

interface ControlPanelProps {
    isPlaying: boolean;
    onPlayPause: () => void;
    onStepForward: () => void;
    onStepBack: () => void;
    onReset: () => void;
    progress: number;
    totalSteps: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    isPlaying,
    onPlayPause,
    onStepForward,
    onStepBack,
    onReset,
    progress,
    totalSteps,
}) => {
    return (
        <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-lg backdrop-blur-md border border-white/10">
            <button
                onClick={onReset}
                className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                title="Reset"
            >
                <RotateCcw size={18} />
            </button>

            <button
                onClick={onStepBack}
                className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                disabled={progress <= 0}
                title="Step Back"
            >
                <SkipBack size={18} />
            </button>

            <button
                onClick={onPlayPause}
                className="p-3 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
                title={isPlaying ? "Pause" : "Play"}
            >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>

            <button
                onClick={onStepForward}
                className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                disabled={progress >= totalSteps - 1}
                title="Step Forward"
            >
                <SkipForward size={18} />
            </button>

            <div className="flex flex-col min-w-[100px] text-xs font-mono text-muted-foreground ml-2">
                <span>Step {progress + 1} / {Math.max(1, totalSteps)}</span>
                <div className="h-1 w-full bg-muted mt-1 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${((progress + 1) / Math.max(1, totalSteps)) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ControlPanel;
