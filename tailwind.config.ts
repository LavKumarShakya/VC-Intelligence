import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                surface: "var(--surface)",
                primary: {
                    DEFAULT: "var(--primary)",
                    hover: "var(--primary-hover)",
                },
                accent: "var(--accent)",
                text: {
                    main: "var(--text-main)",
                    muted: "var(--text-muted)",
                },
                border: "var(--border)",
                success: "var(--success)",
                warning: "var(--warning)",
            },
            fontFamily: {
                sans: ["var(--font-primary)", "Inter", "system-ui", "sans-serif"],
            },
            borderRadius: {
                xl: "1rem",
                lg: "0.75rem",
                md: "0.5rem",
                sm: "0.25rem",
            },
            boxShadow: {
                soft: "0 2px 8px -2px rgba(0, 0, 0, 0.05)",
                card: "0 4px 12px -4px rgba(0, 0, 0, 0.08)",
            }
        },
    },
    plugins: [],
} satisfies Config;
