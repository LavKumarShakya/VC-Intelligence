import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
    size?: "sm" | "md" | "lg" | "icon";
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {

        const variants = {
            primary: "bg-primary text-white hover:bg-primary-hover shadow-sm",
            secondary: "bg-surface hover:bg-background border border-border text-text-main",
            ghost: "hover:bg-background text-text-muted hover:text-text-main",
            danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:border-red-500/30",
            outline: "border-2 border-primary text-primary hover:bg-primary/5 dark:hover:bg-primary/10"
        };

        const sizes = {
            sm: "px-3 py-1.5 text-xs font-medium rounded-md",
            md: "px-4 py-2 text-sm font-medium rounded-lg",
            lg: "px-6 py-3 text-base font-medium rounded-xl",
            icon: "p-2 rounded-lg" // For icon-only buttons
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isLoading && children}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
