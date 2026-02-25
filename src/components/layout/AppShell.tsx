"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ToastProvider } from "../ui/Toast";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Building2, ListTodo, BookmarkCheck } from "lucide-react";
import { StorageUtility } from "@/lib/storage";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Initialize theme on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleGlobalSearch = (query: string) => {
        if (!query.trim()) return;

        // Simplistic global search simulation:
        // We navigate to /companies and pass the query in the URL or let the user save it.
        // In a real app we'd use URLSearchParams but here we'll just persist to localStorage 
        // to pass state between components easily as per requested mock setup.
        StorageUtility.setItem("vc-global-search", query);
        router.push(`/companies?search=${encodeURIComponent(query)}`);
    };

    const navItems = [
        { label: "Companies", icon: Building2, href: "/companies" },
        { label: "Lists", icon: ListTodo, href: "/lists" },
        { label: "Saved Searches", icon: BookmarkCheck, href: "/saved" },
    ];

    return (
        <div className="min-h-screen bg-background text-text-main flex overflow-hidden">
            {/* Desktop Sidebar */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <aside className="relative w-64 h-full bg-surface border-r border-border shadow-xl flex flex-col animate-in slide-in-from-left duration-200">
                        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
                            <span className="font-bold text-lg text-primary">VC Intel</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-text-muted">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <nav className="flex-1 space-y-2 p-4">
                            {navItems.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                                            isActive
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-text-muted"
                                        )}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>
                </div>
            )}

            {/* Main Content Area */}
            <div
                className={cn(
                    "flex-1 flex flex-col min-h-screen transition-all duration-300",
                    isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
                )}
            >
                <Topbar
                    onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
                    onSearch={handleGlobalSearch}
                />
                <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
                        {children}
                    </div>
                </main>
            </div>

            <ToastProvider />
        </div>
    );
}
