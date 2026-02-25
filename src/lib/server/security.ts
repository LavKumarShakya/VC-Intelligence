import { EnrichmentResponse, ERROR_MESSAGES } from "@/types/enrichment";

// --- SSRF Protection ---
export function validateUrlSecurity(urlString: string): URL {
    let url: URL;
    try {
        url = new URL(urlString);
    } catch (e) {
        throw new Error(ERROR_MESSAGES.INVALID_INPUT);
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error(ERROR_MESSAGES.SSRF_BLOCKED);
    }

    const hostname = url.hostname.toLowerCase();

    // Basic check for loopback, any, and link-local addresses
    const blockedHostnames = [
        "localhost",
        "127.0.0.1",
        "0.0.0.0",
        "::1",
        "metadata.google.internal",
        "169.254.169.254"
    ];

    if (blockedHostnames.includes(hostname)) {
        throw new Error(ERROR_MESSAGES.SSRF_BLOCKED);
    }

    // Basic check for private IP ranges (10.x.x.x, 172.16.x.x-172.31.x.x, 192.168.x.x)
    // Converting IP to numbers for easier range checking
    if (/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.test(hostname)) {
        const parts = hostname.split(".").map(Number);
        if (
            parts[0] === 10 ||
            (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
            (parts[0] === 192 && parts[1] === 168) ||
            (parts[0] === 169 && parts[1] === 254)
        ) {
            throw new Error(ERROR_MESSAGES.SSRF_BLOCKED);
        }
    }

    return url;
}

// --- Rate Limiting (In-Memory MVP) ---
// Key: IP address, Value: Array of timestamps of recent requests
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

export function checkRateLimit(ip: string): void {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;

    // Clean up old timestamps and get current ones
    const timestamps = (rateLimitMap.get(ip) || []).filter(ts => ts > windowStart);

    if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
        throw new Error(ERROR_MESSAGES.RATE_LIMITED);
    }

    // Add new request
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);
}

// --- Basic Response Caching (In-Memory MVP) ---
// Key: Website URL, Value: EnrichmentResponse + timestamp
interface CacheEntry {
    data: EnrichmentResponse;
    timestamp: number;
}
const cacheMap = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function getCachedEnrichment(url: string): EnrichmentResponse | null {
    const normalizedUrl = url.toLowerCase().replace(/\/$/, ""); // Normalize trailing slashes
    const entry = cacheMap.get(normalizedUrl);

    if (!entry) return null;

    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
        cacheMap.delete(normalizedUrl);
        return null;
    }

    return entry.data;
}

export function setCachedEnrichment(url: string, data: EnrichmentResponse): void {
    const normalizedUrl = url.toLowerCase().replace(/\/$/, "");
    cacheMap.set(normalizedUrl, {
        data,
        timestamp: Date.now()
    });
}
