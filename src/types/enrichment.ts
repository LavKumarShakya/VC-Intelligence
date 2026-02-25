export interface EnrichmentRequest {
    companyId: string;
    website: string;
}

export interface EnrichmentSource {
    url: string;
    status: number;
    success: boolean;
    timestamp: string;
}

export interface EnrichmentResponse {
    summary: string;
    whatTheyDo: string[];
    keywords: string[];
    signals: string[];
    sources: EnrichmentSource[];
}

export const ERROR_MESSAGES = {
    INVALID_INPUT: "Invalid request payload. Must provide companyId and a valid absolute website URL.",
    SSRF_BLOCKED: "Security policy prevents access to this URL.",
    RATE_LIMITED: "Too many enrichment requests. Please try again later.",
    INSUFFICIENT_CONTENT: "Unable to extract meaningful public content from official website.",
    EXTRACTION_FAILED: "Failed to extract structured enrichment data from the website content.",
    SERVICE_UNAVAILABLE: "Enrichment service temporarily unavailable."
} as const;
