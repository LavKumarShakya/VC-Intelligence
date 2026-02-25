/**
 * Type-safe generic utility for localStorage
 */

export const StorageUtility = {
    getItem<T>(key: string): T | null {
        if (typeof window === "undefined") return null;

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return null;
        }
    },

    setItem<T>(key: string, value: T): void {
        if (typeof window === "undefined") return;

        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    },

    removeItem(key: string): void {
        if (typeof window === "undefined") return;

        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error);
        }
    }
};
