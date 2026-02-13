import Link from "next/link";
import { PROBLEMS } from "@/lib/problems";
import { ArrowRight, Code } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function ProblemsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Navbar */}
            <nav className="border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/25" />
                        <span className="text-xl font-bold tracking-tight">CodeHurdle</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link href="/editor">
                            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-secondary/80 transition-all border border-border">
                                Playground
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-12">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-4">Practice Problems</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Sharpen your algorithm skills with interactive visualizations. Select a problem to start coding.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PROBLEMS.map((problem) => (
                        <div key={problem.id} className="group relative bg-card border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Code className="w-5 h-5" />
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${problem.difficulty === "Easy" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                        problem.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                                            "bg-red-500/10 text-red-500 border-red-500/20"
                                    }`}>
                                    {problem.difficulty}
                                </span>
                            </div>

                            <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                {problem.title}
                            </h2>

                            <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-grow">
                                {problem.description}
                            </p>

                            <Link href={`/editor?problemId=${problem.id}`} className="mt-auto">
                                <button className="w-full py-2.5 bg-secondary hover:bg-primary hover:text-primary-foreground text-secondary-foreground rounded-lg font-medium transition-all flex items-center justify-center gap-2 group-hover:shadow-md">
                                    Solve Challenge <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
