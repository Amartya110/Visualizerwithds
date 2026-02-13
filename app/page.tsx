"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Cpu, Zap, Layout, BookOpen, GitBranch, Layers } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Navbar */}
      <nav className="border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/25" />
            <span className="text-xl font-bold tracking-tight">CodeHurdle</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#algorithms" className="hover:text-primary transition-colors">Algorithms</a>
            <a href="/editor" className="hover:text-primary transition-colors">Playground</a>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/editor">
              <button className="px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 flex items-center gap-2">
                Start Coding <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-secondary text-secondary-foreground text-xs font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Now with Graph Visualizations
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
              Master Algorithms <br /> with <span className="text-primary">Visualization</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop staring at static code. Watch your algorithms run step-by-step, understand complex logic instantly, and debug with clarity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/editor">
                <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-semibold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 flex items-center gap-2">
                  Launch Visualizer <Cpu className="w-5 h-5" />
                </button>
              </Link>
              <a href="#features">
                <button className="px-8 py-4 bg-secondary text-secondary-foreground rounded-full text-lg font-medium hover:bg-secondary/80 transition-all border border-border">
                  Learn More
                </button>
              </a>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative mx-auto max-w-5xl rounded-xl border border-border/50 bg-card/50 backdrop-blur shadow-2xl overflow-hidden aspect-video group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="p-4 border-b border-border/40 bg-muted/20 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mx-auto text-xs text-muted-foreground font-mono bg-background/50 px-3 py-1 rounded-md">BinarySearch.py - Visualizer</div>
            </div>
            <div className="p-10 flex items-center justify-center h-full gap-8">
              {/* Abstract representation of code and array */}
              <div className="space-y-3 w-1/3 opacity-50 blur-[1px]">
                <div className="h-2 w-3/4 bg-foreground/20 rounded" />
                <div className="h-2 w-full bg-foreground/20 rounded" />
                <div className="h-2 w-5/6 bg-foreground/20 rounded" />
                <div className="h-2 w-2/3 bg-foreground/20 rounded" />
              </div>
              <div className="flex gap-2">
                {[1, 3, 5, 7, 9].map((n, i) => (
                  <div key={i} className={`w-12 h-12 rounded bg-card border border-border flex items-center justify-center font-mono font-bold ${i === 2 ? 'border-primary text-primary bg-primary/10 scale-110 shadow-lg shadow-primary/20' : 'text-muted-foreground'}`}>
                    {n}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30 border-y border-border/40">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to learn</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines a powerful code editor with real-time visualizations to help you grasp concepts faster.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6 text-yellow-500" />,
                title: "Real-time Execution",
                desc: "See your code run line-by-line with instant visual feedback."
              },
              {
                icon: <Layout className="w-6 h-6 text-blue-500" />,
                title: "Interactive Canvas",
                desc: "Manipulate arrays, graphs, and trees visually to understand data structures."
              },
              {
                icon: <BookOpen className="w-6 h-6 text-purple-500" />,
                title: "Study Notes",
                desc: "Access curated notes, complexity analysis, and analogies for every algorithm."
              },
              {
                icon: <Code2 className="w-6 h-6 text-green-500" />,
                title: "Multi-Language",
                desc: "Support for Python execution, with C++ and Java coming soon."
              },
              {
                icon: <GitBranch className="w-6 h-6 text-orange-500" />,
                title: "Algo Templates",
                desc: "Start quickly with pre-built templates for BFS, DFS, Binary Search, and more."
              },
              {
                icon: <Layers className="w-6 h-6 text-pink-500" />,
                title: "Step Back & Forth",
                desc: "Control time. Step forward to see changes, step back to understand mistakes."
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40 bg-background">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-primary to-purple-600" />
            <span className="font-bold tracking-tight">CodeHurdle</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 CodeHurdle Visualizer. Built for students & developers.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
