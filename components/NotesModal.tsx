
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, GraduationCap } from 'lucide-react';

interface NotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
}

const NotesModal: React.FC<NotesModalProps> = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    // Enhanced markdown-ish parser
    const parseContent = (text: string) => {
        if (!text) return <p className="text-muted-foreground italic">No notes available for this topic yet.</p>;

        const lines = text.split('\n');
        const elements: React.ReactNode[] = [];
        let inCodeBlock = false;
        let codeBlockContent: string[] = [];

        lines.forEach((line, idx) => {
            const key = idx;

            // Code Block Handling
            if (line.trim().startsWith('```')) {
                if (inCodeBlock) {
                    // End of code block
                    elements.push(
                        <div key={`code-${key}`} className="bg-slate-950 text-slate-50 p-3 rounded-lg font-mono text-sm my-3 border border-slate-800 overflow-x-auto shadow-inner">
                            <pre>{codeBlockContent.join('\n')}</pre>
                        </div>
                    );
                    codeBlockContent = [];
                    inCodeBlock = false;
                } else {
                    // Start of code block
                    inCodeBlock = true;
                }
                return;
            }

            if (inCodeBlock) {
                codeBlockContent.push(line);
                return;
            }

            // Headers
            if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={key} className="text-lg font-bold text-primary mt-6 mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-6 rounded-full bg-primary" />
                        {line.replace('### ', '')}
                    </h3>
                );
                return;
            }

            if (line.startsWith('#### ')) {
                elements.push(
                    <h4 key={key} className="text-md font-semibold text-foreground mt-4 mb-2">
                        {line.replace('#### ', '')}
                    </h4>
                );
                return;
            }

            // Bold Line (e.g. "Concept:")
            if (line.trim().startsWith('**') && line.trim().endsWith(':**')) {
                elements.push(
                    <strong key={key} className="block text-foreground mt-4 mb-2 font-bold text-base">
                        {line.replace(/\*\*/g, '')}
                    </strong>
                );
                return;
            }

            // Lists
            if (line.trim().startsWith('- ')) {
                elements.push(
                    <div key={key} className="flex gap-3 ml-2 mb-2 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 shrink-0" />
                        <span className="text-muted-foreground text-sm leading-relaxed">
                            {line.replace('- ', '').split(/(\*\*.*?\*\*)/g).map((part, i) => (
                                part.startsWith('**') && part.endsWith('**')
                                    ? <strong key={i} className="text-foreground font-medium">{part.slice(2, -2)}</strong>
                                    : part
                            ))}
                        </span>
                    </div>
                );
                return;
            }

            // Empty lines
            if (line.trim() === '') {
                elements.push(<div key={key} className="h-3" />);
                return;
            }

            // Paragraphs
            const parts = line.split(/(\*\*.*?\*\*)/g);
            elements.push(
                <p key={key} className="text-muted-foreground text-sm leading-relaxed mb-1">
                    {parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i} className="text-foreground font-medium bg-primary/5 px-1 rounded">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    })}
                </p>
            );
        });

        return elements;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/10">
                            <GraduationCap className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">{title}</h2>
                            <p className="text-xs text-muted-foreground">Study Notes & Key Concepts</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar bg-card/50">
                    {parseContent(content)}
                </div>

                {/* Footer */}
                <div className="p-4 px-6 border-t border-border bg-muted/30 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground italic">
                        Tip: Try modifying the code to test these concepts!
                    </span>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                    >
                        Close Notes
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotesModal;
