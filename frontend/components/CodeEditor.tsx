"use client";

import React, { useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";

interface CodeEditorProps {
    initialCode: string;
    language: string;
    onChange: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, language, onChange }) => {
    const editorRef = useRef<any>(null);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    return (
        <div className="h-full w-full rounded-md overflow-hidden border border-border bg-[#1e1e1e]">
            <Editor
                height="100%"
                defaultLanguage={language}
                value={initialCode}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                    fontFamily: "'JetBrains Mono', monospace",
                }}
                onMount={handleEditorDidMount}
                onChange={onChange}
            />
        </div>
    );
};

export default CodeEditor;
