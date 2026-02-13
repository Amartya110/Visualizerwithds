"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Cpu, Zap, Layout, BookOpen, GitBranch, Layers, Terminal, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-x-hidden">

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="perspective-grid opacity-20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/50 blur-lg group-hover:blur-xl transition-all" />
              <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white">
                <Code2 className="w-5 h-5" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">CodeHurdle</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#algorithms" className="hover:text-primary transition-colors">Algorithms</a>
            <Link href="/problems" className="hover:text-primary transition-colors">Problems</Link>
            <Link href="/editor" className="hover:text-primary transition-colors">Playground</Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/editor">
              <button className="relative group px-5 py-2 rounded-full text-sm font-medium overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors border border-primary/50 rounded-full" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 blur-md" />
                <span className="relative flex items-center gap-2 text-primary group-hover:text-white transition-colors">
                  Start Coding <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 container mx-auto px-6 z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-xs font-mono mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse box-shadow-green" />
            <span>v2.0 • Graph Algorithms Available</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
            Visualizing the <br />
            <span className="magic-text">Logic of Code</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Don't just read code. <span className="text-foreground font-semibold">Watch it run.</span> <br className="hidden md:block" />
            An advanced algorithmic visualizer for the modern developer.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/editor">
              <button className="group relative px-8 py-4 bg-foreground text-background rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)]">
                <span className="flex items-center gap-2">
                  Launch Visualizer <Terminal className="w-5 h-5" />
                </span>
                <div className="absolute inset-0 rounded-full border border-white/50 opacity-0 group-hover:opacity-100 animate-ping" />
              </button>
            </Link>
            <a href="#features">
              <button className="px-8 py-4 bg-background/50 backdrop-blur text-foreground rounded-full text-lg font-medium hover:bg-white/10 transition-all border border-white/10">
                Explore Features
              </button>
            </a>
          </div>
        </motion.div>

        {/* Floating Abstract Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-20 w-full max-w-5xl relative perspective-1000"
        >
          <div className="relative rounded-xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] flex items-center justify-center group transform transition-transform hover:scale-[1.01] duration-500">

            {/* Fake UI Header */}
            <div className="absolute top-0 inset-x-0 h-10 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
              <div className="ml-4 h-4 w-32 bg-white/5 rounded-full" />
            </div>

            {/* Grid Content */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:24px_24px]" />

            <div className="flex gap-4 md:gap-8 items-center z-10 animate-float">
              {/* Code Block */}
              <div className="hidden md:block p-6 rounded-lg bg-black/50 border border-white/10 backdrop-blur-md w-64 shadow-xl">
                <div className="space-y-2">
                  <div className="h-2 w-12 bg-purple-500/50 rounded" />
                  <div className="h-2 w-24 bg-blue-500/50 rounded ml-4" />
                  <div className="h-2 w-20 bg-green-500/50 rounded ml-8" />
                  <div className="h-2 w-16 bg-white/20 rounded ml-8" />
                  <div className="h-2 w-10 bg-white/20 rounded ml-4" />
                </div>
              </div>

              {/* Array visual */}
              <div className="flex gap-2">
                {[12, 45, 2, 8, 19, 33].map((n, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 0 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ delay: i * 0.1, duration: 2, repeat: Infinity }}
                    className={`w-12 h-16 md:w-16 md:h-20 rounded-lg border flex items-center justify-center text-xl font-mono font-bold shadow-lg ${i === 2 ? 'bg-primary border-primary text-white scale-110 z-10 box-shadow-glow' : 'bg-card border-white/10 text-muted-foreground'}`}
                  >
                    {n}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Glow effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
          </div>

          {/* Reflection */}
          <div className="absolute -bottom-8 left-4 right-4 h-8 bg-gradient-to-b from-primary/20 to-transparent blur-xl opacity-50 rounded-[100%]" />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Engineered for <span className="text-primary">Clarity</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A comprehensive suite of tools designed to decompose complex algorithms into digestible visual steps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-6 h-6 text-yellow-400" />,
                title: "Real-time Execution",
                desc: "Code execution graphed millisecond by millisecond. See variable state changes instantly.",
                span: "col-span-1"
              },
              {
                icon: <Layout className="w-6 h-6 text-blue-400" />,
                title: "Interactive Canvas",
                desc: "Data structures aren't static. Drag, drop, and inspect arrays and graphs in a fully interactive 2D space.",
                span: "md:col-span-2"
              },
              {
                icon: <BookOpen className="w-6 h-6 text-purple-400" />,
                title: "In-Depth Study Mode",
                desc: "Go beyond execution. Access complexity analysis (Big O), detailed notes, and common interview patterns.",
                span: "md:col-span-2"
              },
              {
                icon: <Cpu className="w-6 h-6 text-green-400" />,
                title: "Algorithmic Core",
                desc: "Built on a robust Python emulation engine ensuring 100% logic parity.",
                span: "col-span-1"
              },
              {
                icon: <GitBranch className="w-6 h-6 text-orange-400" />,
                title: "Template Library",
                desc: "Don't start from scratch. One-click access to standard algorithms like DFS, BFS, and Binary Search.",
                span: "col-span-1"
              },
              {
                icon: <Sparkles className="w-6 h-6 text-pink-400" />,
                title: "Visual Polish",
                desc: "A stunning, dark-mode first UI designed to reduce eye strain during long coding sessions.",
                span: "md:col-span-2 bg-gradient-to-br from-primary/10 to-transparent border-primary/20"
              }
            ].map((feature, i) => (
              <div key={i} className={`${feature.span} group p-8 rounded-3xl bg-card/30 border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-300 relative overflow-hidden backdrop-blur-sm`}>
                <div className="absolute top-0 right-0 p-32 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-colors" />

                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-primary to-purple-600" />
            <span className="font-bold tracking-tight">CodeHurdle</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 CodeHurdle. Crafted for the curious.
          </p>
          <div className="flex gap-8 text-sm text-muted-foreground font-medium">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
