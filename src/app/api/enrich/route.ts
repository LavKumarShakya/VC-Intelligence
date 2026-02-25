import { NextRequest, NextResponse } from "next/server";
import { EnrichmentRequest, ERROR_MESSAGES } from "@/types/enrichment";
import { validateUrlSecurity, checkRateLimit, getCachedEnrichment, setCachedEnrichment } from "@/lib/server/security";
import { scrapeCompanyWebsite } from "@/lib/server/scraper";
import { extractEnrichmentData } from "@/lib/server/extractor";

export const maxDuration = 15; // 15 seconds max execution time on Vercel
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    const startTime = Date.now();
    let requestedWebsite = "unknown";

    try {
        // 1. Validate Input Basics
        const body = await req.json();
        const { companyId, website } = body as EnrichmentRequest;

        if (!companyId || !website || typeof website !== "string") {
            return NextResponse.json({ error: ERROR_MESSAGES.INVALID_INPUT }, { status: 400 });
        }

        requestedWebsite = website;

        // 2. SSRF Protection & URL Validation
        let safeUrl: URL;
        try {
            safeUrl = validateUrlSecurity(website);
        } catch (e: any) {
            console.warn(`[API] 🛑 SSRF Blocked URL: ${website}`);
            return NextResponse.json({ error: e.message }, { status: 400 });
        }

        // 3. Rate Limiting (Using IP)
        // Fallback to a default string if IP can't be resolved (e.g. running locally without proxy)
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        try {
            checkRateLimit(ip);
        } catch (e: any) {
            console.warn(`[API] ⏱️ Rate Limit Exceeded for IP: ${ip}`);
            return NextResponse.json({ error: e.message }, { status: 429 });
        }

        // 4. In-Memory Cache Check
        const cachedData = getCachedEnrichment(safeUrl.href);
        if (cachedData) {
            console.info(`[API] ⚡ Cache HIT for ${safeUrl.href}`);
            return NextResponse.json(cachedData, { status: 200 });
        }

        // 5. Scrape Website
        console.info(`[API] 🌐 Scraping started: ${safeUrl.href}`);
        const scraperResult = await scrapeCompanyWebsite(safeUrl.href);
        console.info(`[API] 📄 Scraped ${scraperResult.text.length} characters from ${safeUrl.hostname} across ${scraperResult.sources.length} pages`);

        // 6. LLM Extraction (with strict JSON and retry logic)
        const llmStartTime = Date.now();
        let enrichmentData;

        try {
            enrichmentData = await extractEnrichmentData(scraperResult.text, safeUrl.href, scraperResult.sources);
        } catch (llmError: any) {
            const errorMessage = llmError.message;

            if (errorMessage === ERROR_MESSAGES.SERVICE_UNAVAILABLE) {
                // Exceeded retries on 5xx / Network
                return NextResponse.json({ error: errorMessage }, { status: 502 });
            }
            // Schema validation or deterministic parse failures drop to 500
            console.error(`[API] ❌ LLM Extraction Failed for ${safeUrl.href}: ${errorMessage}`);
            return NextResponse.json({ error: ERROR_MESSAGES.EXTRACTION_FAILED }, { status: 500 });
        }

        console.info(`[API] 🧠 LLM extracted JSON in ${Date.now() - llmStartTime}ms for ${safeUrl.href}`);

        // 7. Store in Cache and Return
        setCachedEnrichment(safeUrl.href, enrichmentData);

        console.info(`[API] ✅ Success: ${safeUrl.href} completed in ${Date.now() - startTime}ms`);
        return NextResponse.json(enrichmentData, { status: 200 });

    } catch (error: any) {
        // Catch-all for unexpected internal errors or controlled scraper errors
        console.error(`[API] 💥 Internal error processing ${requestedWebsite}:`, error.message || error);

        // We pass through specific functional constraints (like not enough text on SPA)
        if (error.message === ERROR_MESSAGES.INSUFFICIENT_CONTENT) {
            return NextResponse.json({ error: error.message }, { status: 502 });
        }

        return NextResponse.json(
            { error: "Internal processing failure occurred." },
            { status: 500 }
        );
    }
}
