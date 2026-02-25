import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500", className)}>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-text-main mb-1">{title}</h3>
            <p className="text-sm text-text-muted max-w-sm mb-6 pb-2">
                {description}
            </p>
            {action && <div>{action}</div>}
        </div>
    );
}
