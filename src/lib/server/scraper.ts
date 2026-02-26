import * as cheerio from "cheerio";
import { ERROR_MESSAGES, EnrichmentSource } from "@/types/enrichment";

// Exit boundaries
const MAX_PAGES_TO_SCRAPE = 4;
const MAX_TOTAL_CHARS = 12000;
const TIMEOUT_MS = 5000; // 5s per page per requirements
const MIN_CONTENT_CHARS = 500;

export interface ScraperResult {
    text: string;
    sources: EnrichmentSource[];
}

export async function scrapeCompanyWebsite(website: string): Promise<ScraperResult> {
    const originalUrl = new URL(website.startsWith("http") ? website : `https://${website}`);
    const originalHostname = originalUrl.hostname;

    // Prioritized paths: homepage -> about -> docs -> blog -> careers
    const paths = ["", "/about", "/docs", "/blog", "/careers"];
    let combinedText = "";
    let pagesScraped = 0;
    const sources: EnrichmentSource[] = [];

    for (const path of paths) {
        if (pagesScraped >= MAX_PAGES_TO_SCRAPE) break;
        if (combinedText.length >= MAX_TOTAL_CHARS) break;

        const targetUrlStr = new URL(path, originalUrl).href;
        const sourceEntry: EnrichmentSource = {
            url: targetUrlStr,
            status: 0,
            success: false,
            timestamp: new Date().toISOString()
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

            const response = await fetch(targetUrlStr, {
                signal: controller.signal,
                redirect: "follow",
                headers: {
                    "User-Agent": "VCIntelligence/1.0 (Enrichment Bot)" // Polite UA
                }
            });

            clearTimeout(timeoutId);

            sourceEntry.url = response.url;
            sourceEntry.status = response.status;

            // Origin Enforcement (allow subdomains, www, HTTPS upgrades)
            const finalUrl = new URL(response.url);
            if (!isSameRegistrableDomain(originalHostname, finalUrl.hostname)) {
                sources.push(sourceEntry);
                continue;
            }

            if (!response.ok) {
                sources.push(sourceEntry);
                continue;
            }

            const html = await response.text();
            const text = cleanHtml(html);

            if (text.length > 300) {
                combinedText += `\n\n--- Content from ${response.url} ---\n\n${text}`;
                sourceEntry.success = true;
                pagesScraped++;
            }

            sources.push(sourceEntry);
        } catch (error) {
            sources.push(sourceEntry);
        }
    }

    const successfulSources = sources.filter(s => s.success);

    // Handle SPA / blocked / almost-empty responses
    if (combinedText.length < MIN_CONTENT_CHARS || successfulSources.length === 0) {
        throw new Error(ERROR_MESSAGES.INSUFFICIENT_CONTENT);
    }

    return {
        text: combinedText.slice(0, MAX_TOTAL_CHARS),
        sources
    };
}

/**
 * Uses cheerio to safely extract meaningful visible text from raw HTML.
 */
function cleanHtml(html: string): string {
    const $ = cheerio.load(html);

    // Remove noise
    $("script").remove();
    $("style").remove();
    $("noscript").remove();
    $("nav").remove();
    $("footer").remove();
    $("header").remove();

    // We don't want massive SVG data chunks
    $("svg").remove();

    // Extract combined text from the body
    let text = $("body").text();

    // Normalize whitespace (reduce double spaces, tabs, and crazy newlines)
    text = text.replace(/\s+/g, ' ').trim();

    return text;
}

/**
 * Checks if two hostnames belong to the same registrable domain for MVP scope.
 * Handles www normalization and subdomains.
 */
function isSameRegistrableDomain(originalHost: string, newHost: string): boolean {
    if (originalHost === newHost) return true;

    // Normalize www
    const cleanOriginal = originalHost.replace(/^www\./, '');
    const cleanNew = newHost.replace(/^www\./, '');

    if (cleanOriginal === cleanNew) return true;

    // Allow if one is a subdomain of the other
    if (cleanNew.endsWith(`.${cleanOriginal}`)) return true;
    if (cleanOriginal.endsWith(`.${cleanNew}`)) return true;

    return false;
}
