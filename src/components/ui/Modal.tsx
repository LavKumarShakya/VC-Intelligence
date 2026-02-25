import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal panel */}
            <div
                className={cn(
                    "relative z-50 w-full max-w-lg rounded-xl bg-surface p-6 shadow-xl border border-border sm:my-8 animate-in zoom-in-95 duration-200",
                    className
                )}
            >
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold leading-6 text-text-main">
                            {title}
                        </h3>
                        {description && (
                            <p className="mt-1 text-sm text-text-muted">
                                {description}
                            </p>
                        )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="-mt-1 -mr-1 h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="mt-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
