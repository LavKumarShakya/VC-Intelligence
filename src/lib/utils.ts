import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges tailwind classes seamlessly
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Formats a date string to a readable format
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

/**
 * Generates and downloads a CSV file from an array of objects
 */
export function downloadCSV(data: any[], filename: string) {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(item =>
        Object.values(item).map(val => {
            // Escape quotes and wrap in quotes if contains comma
            const stringVal = String(val).replace(/"/g, '""');
            return stringVal.includes(",") ? `"${stringVal}"` : stringVal;
        }).join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Generates and downloads a JSON file from an object
 */
export function downloadJSON(data: any, filename: string) {
    if (!data) return;

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
