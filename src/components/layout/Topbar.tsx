"use client";

import { useState, useEffect } from "react";
import { Search, Moon, Sun, Menu } from "lucide-react";
import { Button } from "../ui/Button";

interface TopbarProps {
    onMobileMenuToggle: () => void;
    onSearch: (query: string) => void;
}

export function Topbar({ onMobileMenuToggle, onSearch }: TopbarProps) {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [searchQuery, setSearchQuery] = useState("");

    // Initialize theme from HTML class or localStorage
    useEffect(() => {
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "dark" : "light");
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);

        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur shadow-soft">
            <div className="flex items-center gap-4 flex-1">
                {/* Mobile Menu Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={onMobileMenuToggle}
                >
                    <Menu className="w-5 h-5" />
                </Button>

                {/* Global Search */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="flex-1 max-w-md relative"
                >
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search companies, lists..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        />
                    </div>
                </form>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                    {theme === "light" ? (
                        <Moon className="w-5 h-5 text-text-muted" />
                    ) : (
                        <Sun className="w-5 h-5 text-text-muted" />
                    )}
                </Button>
            </div>
        </header>
    );
}
