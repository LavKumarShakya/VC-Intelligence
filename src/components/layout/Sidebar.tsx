"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, ListTodo, BookmarkCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";

interface SidebarProps {
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, toggleCollapse }: SidebarProps) {
    const pathname = usePathname();

    const navItems = [
        { label: "Companies", icon: Building2, href: "/companies" },
        { label: "Lists", icon: ListTodo, href: "/lists" },
        { label: "Saved Searches", icon: BookmarkCheck, href: "/saved" },
    ];

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-40 hidden h-screen bg-surface border-r border-border transition-all duration-300 md:flex flex-col",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo Area */}
            <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-border">
                {!isCollapsed && (
                    <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-primary">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <span>VC Intel</span>
                    </div>
                )}
                {isCollapsed && (
                    <div className="mx-auto w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                    </div>
                )}
            </div>

            {/* Navigation */}
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
                                    : "text-text-muted hover:bg-background hover:text-text-main",
                                isCollapsed && "justify-center px-0"
                            )}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <item.icon className="hidden md:block w-5 h-5 shrink-0" />
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Toggle Button */}
            <div className="p-4 border-t border-border flex justify-end">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleCollapse}
                    className="text-text-muted hover:text-text-main w-full flex justify-center"
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </Button>
            </div>
        </aside>
    );
}
