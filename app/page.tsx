"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import CodeEditor from "@/components/CodeEditor";
import VisualizerCanvas from "@/components/VisualizerCanvas";
import ControlPanel from "@/components/ControlPanel";
import TestCaseGenerator from "@/components/TestCaseGenerator";
import NotesModal from "@/components/NotesModal"; // Import Modal
import { ALGORITHM_TEMPLATES, AlgorithmType } from "@/lib/templates";
import { BookOpen } from "lucide-react"; // Import Icon

export default function Home() {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType>("Binary Search");
  const [code, setCode] = useState(ALGORITHM_TEMPLATES["Binary Search"].code);
  const [inputVal, setInputVal] = useState("");
  const [traces, setTraces] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(800);
  const [isNotesOpen, setIsNotesOpen] = useState(false); // Notes State

  // Helper to append/replace test case in code
  const handleTestCaseGenerate = (snippet: string) => {
    const lines = code.split('\n');
    let lastFuncLine = -1;

    // Find last indented line (part of function)
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('    ') || lines[i].startsWith('\t')) {
        lastFuncLine = i;
      }
    }

    // If we found a function body, keep up to that point.
    // If not, just append.
    let newCode = code;
    if (lastFuncLine !== -1 && lastFuncLine < lines.length - 1) {
      // Keep function + 1 empty line
      newCode = lines.slice(0, lastFuncLine + 1).join('\n') + "\n" + snippet;
    } else {
      newCode = code + "\n" + snippet;
    }

    setCode(newCode);
  };

  // When algorithm selection changes, update code
  const handleAlgoChange = (algo: AlgorithmType) => {
    setSelectedAlgo(algo);
    setCode(ALGORITHM_TEMPLATES[algo].code);
    setTraces([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Playback loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && traces.length > 0) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= traces.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, traces, playbackSpeed]);

  const handleRunCode = async () => {
    setIsLoading(true);
    setTraces([]);
    setCurrentStep(0);
    setIsPlaying(false);

    try {
      // Use relative path for Vercel (it handles rewrites), or env var
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
      const response = await axios.post(`${apiUrl}/simulate`, {
        code: code,
        language: "python",
        testcases: [inputVal || " "]
      });

      if (response.data.results && response.data.results.length > 0) {
        setTraces(response.data.results[0].trace);
        setIsPlaying(true);
      }
    } catch (error: any) {
      console.error("Error executing code:", error);
      const startMessage = error.response?.data?.detail || error.message || "Unknown error";
      alert(`Execution Error: ${startMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden font-sans">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/40 px-6 py-3 bg-card/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/25" />
            <h1 className="text-xl font-bold tracking-tight hidden md:block">CodeHurdle <span className="text-primary">Visualizer</span></h1>
          </div>

          {/* Algorithm Selector */}
          <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg border border-border/50">
            {Object.keys(ALGORITHM_TEMPLATES).map((algo) => (
              <button
                key={algo}
                onClick={() => handleAlgoChange(algo as AlgorithmType)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${selectedAlgo === algo
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
              >
                {algo}
              </button>
            ))}
          </div>

          {/* Study Notes Button */}
          <button
            onClick={() => setIsNotesOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors border border-primary/20"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Study Notes
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Speed:</span>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={2100 - playbackSpeed} // Invert so right is faster
              onChange={(e) => setPlaybackSpeed(2100 - parseInt(e.target.value))}
              className="w-24 accent-primary"
            />
          </div>
          <button
            onClick={handleRunCode}
            disabled={isLoading}
            className="px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? "Running..." : "Run Code"}
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 overflow-hidden">

        {/* Left Panel: Code Editor */}
        <div className="h-full border-r border-border/40 bg-card/30 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="p-3 border-b border-border/40 bg-muted/20 flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur z-10">
            <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Editor
            </h2>
            <span className="text-xs text-muted-foreground">{selectedAlgo}</span>
          </div>
          <div className="flex-1 p-0 overflow-hidden relative min-h-[400px]">
            <CodeEditor
              initialCode={code}
              language="python"
              onChange={(val) => setCode(val || "")}
            />
          </div>
          <TestCaseGenerator
            type={selectedAlgo.includes("Graph") ? "graph" : "array"}
            algo={selectedAlgo}
            onGenerate={handleTestCaseGenerate}
          />
        </div>

        {/* Right Panel: Visualization & Controls */}
        <div className="h-full lg:col-span-2 flex flex-col relative bg-gradient-to-br from-background via-background to-primary/5">
          <div className="p-3 border-b border-border/40 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" /> Visualization
            </h2>

            <ControlPanel
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onStepForward={() => setCurrentStep(Math.min(traces.length - 1, currentStep + 1))}
              onStepBack={() => setCurrentStep(Math.max(0, currentStep - 1))}
              onReset={() => { setIsPlaying(false); setCurrentStep(0); }}
              progress={currentStep}
              totalSteps={traces.length}
            />
          </div>

          <div className="flex-1 p-6 relative overflow-hidden flex items-start justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
            {traces.length > 0 ? (
              <VisualizerCanvas traceStep={traces[currentStep]} />
            ) : (
              <div className="text-center space-y-4 m-auto">
                <div className="w-24 h-24 mx-auto rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
                  <div className="w-12 h-12 rounded-lg bg-primary shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
                </div>
                <p className="text-muted-foreground font-medium">Run code to visualize execution</p>
                <p className="text-xs text-muted-foreground/60 max-w-xs mx-auto">
                  Try selecting "DFS" or "BFS" from the top menu to see different algorithms in action.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Notes Modal */}
      <NotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        title={selectedAlgo}
        content={(ALGORITHM_TEMPLATES[selectedAlgo] as any).notes || ""}
      />
    </main>
  );
}
