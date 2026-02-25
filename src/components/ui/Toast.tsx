"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "warning" | "info";

interface ToastProps {
    id: string;
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: (id: string) => void;
}

export function Toast({ id, message, type = "info", duration = 3000, onClose }: ToastProps) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => onClose(id), duration);
            return () => clearTimeout(timer);
        }
    }, [id, duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-success" />,
        warning: <AlertTriangle className="w-5 h-5 text-warning" />,
        info: <Info className="w-5 h-5 text-accent" />
    };

    return (
        <div className="flex items-center gap-3 p-4 mb-3 bg-surface border border-border rounded-lg shadow-card animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto">
            {icons[type]}
            <p className="text-sm font-medium pr-4">{message}</p>
            <button
                onClick={() => onClose(id)}
                className="ml-auto text-text-muted hover:text-text-main transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

// Global Toast Manager
let toastId = 0;
let addToastFn: ((toast: Omit<ToastProps, "id" | "onClose">) => void) | null = null;

export function toast(message: string, type: ToastType = "info", duration = 3000) {
    if (addToastFn) {
        addToastFn({ message, type, duration });
    } else {
        console.warn("ToastProvider not mounted.", message);
    }
}

export function ToastProvider() {
    const [toasts, setToasts] = useState<Omit<ToastProps, "onClose">[]>([]);

    useEffect(() => {
        addToastFn = (toast) => {
            setToasts(prev => [...prev, { ...toast, id: String(++toastId) }]);
        };
        return () => {
            addToastFn = null;
        };
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-none">
            {toasts.map(t => (
                <Toast key={t.id} {...t} onClose={removeToast} />
            ))}
        </div>
    );
}
