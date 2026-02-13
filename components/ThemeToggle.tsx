"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground relative group"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            <span className="sr-only">Toggle theme</span>
            {theme === 'dark' ? (
                <Moon className="w-5 h-5 group-hover:text-primary transition-colors" />
            ) : (
                <Sun className="w-5 h-5 group-hover:text-yellow-500 transition-colors" />
            )}
            <div className="absolute inset-0 rounded-full bg-primary/10 scale-0 group-hover:scale-100 transition-transform -z-10" />
        </button>
    )
}
