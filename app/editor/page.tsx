"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useTheme } from "next-themes";
import Editor, { OnMount } from "@monaco-editor/react";
import { Play, RotateCcw, BookOpen, ChevronLeft, Lightbulb, Code2, Sparkles } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import VisualizerCanvas from "@/components/VisualizerCanvas";
import { ALGORITHM_TEMPLATES } from "@/lib/templates";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSearchParams } from "next/navigation";
import { PROBLEMS } from "@/lib/problems";
import TestCaseGenerator from "@/components/TestCaseGenerator";

// --- Simple Markdown Renderer ---
const SimpleMarkdown = ({ content }: { content: string }) => {
    if (!content) return null;

    // Split by newlines and process
    const lines = content.split('\n');

    return (
        <div className="space-y-2 text-sm">
            {lines.map((line, i) => {
                if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-lg font-bold mt-4 mb-2 text-primary">{line.replace('### ', '')}</h3>;
                }
                if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i}><strong className="text-foreground">{line.replace(/\*\*/g, '')}</strong></p>;
                }
                if (line.trim().startsWith('- ')) {
                    return (
                        <div key={i} className="flex gap-2 ml-2">
                            <span className="text-primary">•</span>
                            <span>{line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, (match, p1) => p1)}</span> {/* rudimentary bold in list */}
                        </div>
                    );
                }
                // Handle bold inside paragraph
                const parts = line.split(/(\*\*.*?\*\*)/g);
                return (
                    <p key={i} className="leading-relaxed text-muted-foreground">
                        {parts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={j} className="text-foreground">{part.slice(2, -2)}</strong>;
                            }
                            if (part.startsWith('`') && part.endsWith('`')) {
                                return <code key={j} className="bg-muted px-1 py-0.5 rounded font-mono text-xs text-primary">{part.slice(1, -1)}</code>;
                            }
                            return part;
                        })}
                    </p>
                );
            })}
        </div>
    );
};

function EditorContent() {
    const { theme } = useTheme();
    const searchParams = useSearchParams();
    const problemId = searchParams.get("problemId");

    // State
    const [code, setCode] = useState<string>(ALGORITHM_TEMPLATES["Binary Search"].code);
    const [selectedAlgo, setSelectedAlgo] = useState<string>("Binary Search");
    const [output, setOutput] = useState<any>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(500);
    const [isPlaying, setIsPlaying] = useState(false);
    const playbackInterval = useRef<NodeJS.Timeout | null>(null);

    // Panels State
    const [currentProblem, setCurrentProblem] = useState<any>(null);
    const [showProblemDesc, setShowProblemDesc] = useState(false);
    const [showNotes, setShowNotes] = useState(false); // For Algorithm Mode

    // Load Problem if ID exists
    useEffect(() => {
        if (problemId) {
            const problem = PROBLEMS.find(p => p.id === problemId);
            if (problem) {
                setCurrentProblem(problem);
                setCode(problem.template);
                setShowProblemDesc(true);
                setShowNotes(false);
                setSelectedAlgo(""); // Clear algo selection in problem mode
            }
        }
    }, [problemId]);

    // Execute Code
    const runCode = async () => {
        setIsRunning(true);
        setError(null);
        setOutput(null);
        setCurrentStep(0);
        setIsPlaying(false);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const payload = {
                code,
                language: "python",
                testcases: [""] // Send one empty input to ensure the backend executes the code at least once
            };

            const response = await axios.post(`${API_URL}/api/simulate`, payload);

            if (response.data.error) {
                setError(response.data.error);
            } else if (response.data.results && response.data.results.length > 0) {
                // The backend returns a list of results. For now, we visualize the first one.
                // In the future, we could add a UI to switch between test case traces.
                setOutput(response.data.results[0].trace);
            } else if (response.data.trace) {
                // Fallback for backward compatibility if backend changes
                setOutput(response.data.trace);
            } else {
                setError("No execution trace returned.");
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to execute code. Ensure the backend is running.");
        } finally {
            setIsRunning(false);
        }
    };

    const handleReset = () => {
        setOutput(null);
        setError(null);
        setCurrentStep(0);
        setIsPlaying(false);
    };

    const nextStep = () => {
        if (output && currentStep < output.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsPlaying(false);
        }
    };

    const prevStep = () => {
        if (output && currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    useEffect(() => {
        if (isPlaying) {
            playbackInterval.current = setInterval(nextStep, playbackSpeed);
        } else {
            if (playbackInterval.current) clearInterval(playbackInterval.current);
        }
        return () => {
            if (playbackInterval.current) clearInterval(playbackInterval.current);
        };
    }, [isPlaying, playbackSpeed, output, currentStep]);


    const handleEditorDidMount: OnMount = (editor, monaco) => {
        // scroll to bottom logic if needed
    };

    const loadTemplate = (name: string) => {
        const template = ALGORITHM_TEMPLATES[name as keyof typeof ALGORITHM_TEMPLATES];
        if (template) {
            setCode(template.code);
            setSelectedAlgo(name);
            setCurrentProblem(null);
            setShowProblemDesc(false);
            // Don't auto-show notes, let user toggle
        }
    };

    const handleGenerateTestCase = (snippet: string) => {
        // Basic check to see where to insert. For now, append to end or replace last lines?
        // Appending is safer.
        setCode(prev => prev + "\n" + snippet);
    };

    return (
        <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden font-sans">

            {/* Header */}
            <header className="flex flex-col md:flex-row items-center justify-between border-b border-border/40 px-4 py-3 bg-card/50 backdrop-blur-md z-10 gap-3 md:gap-0 shadow-sm">
                <div className="flex items-center justify-between w-full md:w-auto gap-4">
                    <Link href={currentProblem ? "/problems" : "/"} className="flex items-center gap-2 group">
                        <div className="p-1.5 rounded-lg bg-secondary group-hover:bg-primary/20 transition-colors border border-border/50">
                            <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <span className="font-semibold tracking-tight text-lg magic-text">{currentProblem ? "Back to Problems" : "CodeHurdle"}</span>
                    </Link>

                    {currentProblem && (
                        <div className="flex items-center gap-2 ml-2">
                            <div className="h-4 w-[1px] bg-border mx-2"></div>
                            <span className="font-bold text-sm hidden sm:inline">{currentProblem.title}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${currentProblem.difficulty === "Easy" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                currentProblem.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                                    "bg-red-500/10 text-red-500 border-red-500/20"
                                }`}>
                                {currentProblem.difficulty}
                            </span>
                        </div>
                    )}

                    <div className="md:hidden flex items-center gap-2 ml-auto">
                        <ThemeToggle />
                        {/* Mobile Toggles */}
                        {currentProblem ? (
                            <button
                                onClick={() => setShowProblemDesc(!showProblemDesc)}
                                className={`p-2 rounded-lg transition-colors ${showProblemDesc ? 'bg-primary/20 text-primary' : 'hover:bg-muted'}`}
                            >
                                <BookOpen className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowNotes(!showNotes)}
                                className={`p-2 rounded-lg transition-colors ${showNotes ? 'bg-primary/20 text-primary' : 'hover:bg-muted'}`}
                            >
                                <Lightbulb className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end overflow-x-auto pb-1 md:pb-0 hide-scrollbar">

                    {!currentProblem && (
                        <select
                            className="bg-secondary/30 border border-border text-xs rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 hover:bg-secondary/50 transition-colors cursor-pointer"
                            onChange={(e) => loadTemplate(e.target.value)}
                            value={selectedAlgo}
                        >
                            <option disabled value="">Select Algorithm</option>
                            {Object.keys(ALGORITHM_TEMPLATES).map(key => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                    )}

                    <div className="flex items-center gap-2">
                        <button
                            onClick={runCode}
                            disabled={isRunning}
                            className={`
                    px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all relative overflow-hidden group
                    ${isRunning
                                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-500/25 active:scale-95 border border-green-400/20"
                                }
                `}
                        >
                            {isRunning ? (
                                <>
                                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>Run Code</span>
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                                </>
                            )}
                        </button>
                    </div>

                    <div className="hidden md:flex items-center gap-2 ml-2">
                        <ThemeToggle />
                        {currentProblem ? (
                            <button
                                onClick={() => setShowProblemDesc(!showProblemDesc)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${showProblemDesc
                                    ? "bg-primary/10 text-primary border-primary/20 shadow-inner"
                                    : "bg-card border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                {showProblemDesc ? "Hide" : "Problem"}
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowNotes(!showNotes)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${showNotes
                                    ? "bg-primary/10 text-primary border-primary/20 shadow-inner"
                                    : "bg-card border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <Lightbulb className="w-3.5 h-3.5" />
                                {showNotes ? "Hide Notes" : "Show Notes"}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background to-secondary/20">

                {/* Editor Section */}
                <div className={`flex flex-col border-r border-border/40 transition-all duration-300 ${(!output && !currentProblem && !showNotes) ? "w-full md:w-1/2" : "w-full md:w-1/3"}`}>
                    <Editor
                        height="100%"
                        defaultLanguage="python"
                        value={code}
                        theme={theme === "dark" ? "vs-dark" : "light"}
                        onChange={(value) => setCode(value || "")}
                        onMount={handleEditorDidMount}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineHeight: 22,
                            padding: { top: 20 },
                            scrollBeyondLastLine: false,
                            smoothScrolling: true,
                            fontFamily: "JetBrains Mono, monospace",
                            cursorBlinking: "smooth",
                            cursorSmoothCaretAnimation: "on"
                        }}
                    />
                </div>

                {/* Info Panel: Problem Description OR Algorithm Notes */}
                <AnimatePresence mode="wait">
                    {(currentProblem && showProblemDesc) || (!currentProblem && showNotes && selectedAlgo && ALGORITHM_TEMPLATES[selectedAlgo as keyof typeof ALGORITHM_TEMPLATES]) ? (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-0 left-0 h-full w-full md:w-1/2 bg-background/95 backdrop-blur-xl border-r border-border/50 z-20 p-6 overflow-y-auto shadow-2xl custom-scrollbar"
                        >
                            <div className="flex justify-between items-start mb-6 sticky top-0 bg-background/95 backdrop-blur py-2 z-10 border-b border-border/50">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                        {currentProblem ? currentProblem.title : selectedAlgo}
                                    </h2>
                                    {currentProblem && (
                                        <div className="flex gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${currentProblem.difficulty === "Easy" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                                currentProblem.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                                                    "bg-red-500/10 text-red-500 border-red-500/20"
                                                }`}>
                                                {currentProblem.difficulty}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => currentProblem ? setShowProblemDesc(false) : setShowNotes(false)} className="p-1.5 hover:bg-muted rounded-full text-muted-foreground transition-colors">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="prose prose-sm dark:prose-invert max-w-none pb-10">
                                {currentProblem ? (
                                    <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{currentProblem.description}</p>
                                ) : (
                                    <>
                                        <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                                            {ALGORITHM_TEMPLATES[selectedAlgo as keyof typeof ALGORITHM_TEMPLATES]?.description}
                                        </p>

                                        {ALGORITHM_TEMPLATES[selectedAlgo as keyof typeof ALGORITHM_TEMPLATES]?.notes && (
                                            <div className="mt-6 pt-6 border-t border-border/50">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Sparkles className="w-4 h-4 text-purple-500" />
                                                    <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Concept & Notes</h3>
                                                </div>
                                                <div className="bg-card/30 rounded-xl p-4 border border-border/50 shadow-sm">
                                                    <SimpleMarkdown content={ALGORITHM_TEMPLATES[selectedAlgo as keyof typeof ALGORITHM_TEMPLATES]?.notes} />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {currentProblem && currentProblem.testCases && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <Code2 className="w-4 h-4 text-primary" />
                                            Test Cases
                                        </h3>
                                        <div className="flex flex-col gap-3">
                                            {currentProblem.testCases.map((tc: any, i: number) => (
                                                <div key={i} className="bg-muted/30 p-3 rounded-lg border border-border/50 font-mono text-xs hover:border-primary/30 transition-colors">
                                                    <div className="mb-1"><span className="text-muted-foreground">Input:</span> <span className="text-foreground">{tc.input}</span></div>
                                                    <div><span className="text-muted-foreground">Output:</span> <span className="text-primary">{tc.expected}</span></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                {/* Right Side: Visualizer OR Empty State OR TestCase Generator */}
                <div className="flex-1 bg-muted/5 flex flex-col min-h-0 relative">

                    {/* Toolbar if Output exists */}
                    {output && (
                        <div className="h-14 border-b border-border/40 bg-card/30 backdrop-blur-md flex items-center justify-between px-4 shrink-0 shadow-sm">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all active:scale-95 shadow-[0_0_10px_-3px_rgba(var(--primary),0.3)]"
                                >
                                    {isPlaying ? <span className="w-4 h-4 block bg-current rounded-sm shadow-[0_0_8px_currentColor]" /> : <Play className="w-4 h-4 fill-current drop-shadow" />}
                                </button>
                                {/* Slider */}
                                <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full border border-border/50">
                                    <input
                                        type="range"
                                        min="0"
                                        max={output.length - 1}
                                        value={currentStep}
                                        onChange={(e) => { setIsPlaying(false); setCurrentStep(parseInt(e.target.value)); }}
                                        className="w-24 md:w-36 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <span className="text-[10px] font-mono font-bold text-muted-foreground min-w-[3rem] text-right">{currentStep} / {output.length - 1}</span>
                                </div>
                            </div>

                            {/* Right Controls */}
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex items-center gap-2">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Speed</span>
                                    <select
                                        value={playbackSpeed}
                                        onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))}
                                        className="bg-background/50 text-xs border border-border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary/50"
                                    >
                                        <option value={1000}>x0.5</option>
                                        <option value={500}>x1.0</option>
                                        <option value={100}>x2.0</option>
                                    </select>
                                </div>
                                <div className="h-6 w-[1px] bg-border/50 hidden sm:block"></div>
                                <button
                                    onClick={handleReset}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 text-xs font-semibold border border-orange-500/20 transition-all active:scale-95"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">New Input</span>
                                    <span className="sm:hidden">Reset</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="p-4 m-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-start gap-3 shrink-0 shadow-lg shadow-red-500/5">
                            <div className="mt-0.5 p-1 bg-red-500/20 rounded-full"><RotateCcw className="w-4 h-4" /></div>
                            <div>
                                <div className="font-bold mb-1 tracking-tight">Execution Error</div>
                                <div className="font-mono text-xs opacity-90 leading-relaxed bg-black/20 p-2 rounded border border-red-500/10">
                                    {typeof error === 'object' ? JSON.stringify(error) : error}
                                </div>
                                <button onClick={handleReset} className="mt-3 text-xs font-semibold hover:underline">Try Again</button>
                            </div>
                        </div>
                    )}

                    {/* Visualizer Canvas */}
                    {output ? (
                        <div className="flex-1 overflow-hidden relative">
                            <div className="w-full h-full border-l border-t border-border/50 bg-background/40 backdrop-blur-sm relative">
                                <VisualizerCanvas traceStep={output[currentStep]} />
                            </div>
                        </div>
                    ) : (
                        /* Empty State & Test Case Generator */
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 relative overflow-y-auto custom-scrollbar">
                            {!error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center mb-10"
                                >
                                    <div className="w-20 h-20 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-xl border border-white/5 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
                                        <Code2 className="w-10 h-10 text-primary drop-shadow-md" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">Ready to Visualize</h3>
                                    <p className="text-sm max-w-sm mx-auto text-muted-foreground/80 leading-relaxed">
                                        {currentProblem
                                            ? "Review the problem description, write your solution, and click Run."
                                            : "Select an algorithm or generate a test case below to visualize execution."}
                                    </p>
                                </motion.div>
                            )}

                            {/* Test Case Generator (Only in Algo Mode) */}
                            {!currentProblem && selectedAlgo && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="w-full max-w-md"
                                >
                                    <TestCaseGenerator
                                        type={selectedAlgo.includes("Graph") ? "graph" : "array"}
                                        algo={selectedAlgo}
                                        onGenerate={handleGenerateTestCase}
                                    />
                                </motion.div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default function EditorPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-background text-foreground">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                    <span className="text-sm text-muted-foreground font-mono animate-pulse">Initializing Environment...</span>
                </div>
            </div>
        }>
            <EditorContent />
        </Suspense>
    );
}
