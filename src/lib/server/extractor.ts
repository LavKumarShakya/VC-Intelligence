import { GoogleGenAI, Type } from "@google/genai";
import { ERROR_MESSAGES, EnrichmentResponse, EnrichmentSource } from "@/types/enrichment";
import { validateEnrichmentData } from "./validator";

export class LlmUpstreamError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "LlmUpstreamError";
    }
}

/**
 * Executes the LLM call with a single retry specifically for network or 5xx failures.
 * Incorporates a 500ms exponential-style backoff via standard Promise delay.
 */
export async function extractEnrichmentData(text: string, website: string, sources: EnrichmentSource[]): Promise<EnrichmentResponse> {
    try {
        return await executeExtraction(text, website, sources);
    } catch (error: any) {
        console.warn(`[Extractor] LLM Attempt 1 failed for ${website}:`, error.message);

        // We strictly DO NOT retry on Zod validation or JSON parse errors, because those are deterministic.
        // We only retry on LlmUpstreamError (5xx or fetch failures).
        if (error instanceof LlmUpstreamError) {
            console.info(`[Extractor] Retrying extraction in 500ms...`);
            await new Promise(resolve => setTimeout(resolve, 500));

            try {
                return await executeExtraction(text, website, sources);
            } catch (retryError: any) {
                console.error(`[Extractor] Retry failed for ${website}. Escaping.`);
                throw new Error(ERROR_MESSAGES.SERVICE_UNAVAILABLE); // Maps to 502
            }
        }

        // Pass through deterministic processing errors mapping to 500
        throw new Error(ERROR_MESSAGES.EXTRACTION_FAILED);
    }
}

async function executeExtraction(text: string, website: string, sources: EnrichmentSource[]): Promise<EnrichmentResponse> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("Missing GEMINI_API_KEY in environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
    Analyze the following scraped website content for the company at ${website}.
    Extract the intelligence into strict structured JSON.
    
    CRITICAL INSTRUCTION:
    - You MUST base all extracted intelligence ONLY on the provided scraped content below.
    - DO NOT hallucinate.
    - DO NOT pull information from outside sources (no GitHub, Twitter, news, or funding databases that are not explicitly stated in the text).
    
    Rules for extraction:
    - summary: A crisp 1-2 sentence pitch of the company based ONLY on the text.
    - whatTheyDo: An array of 2-5 bullet points detailing specific capabilities or products mentioned in the text.
    - keywords: An array of 3-7 tags (e.g. "Fintech", "Series A", "B2B SaaS") explicitly supported by the text.
    - signals: An array of business indicators found. Examples: "Active hiring page detected" if /careers was scraped, "Security compliance detected" if compliance page was scraped. DO NOT infer signals from general knowledge.
    - sources: Use Exactly the following JSON array of sources exactly as provided, do not infer sources: ${JSON.stringify(sources)}

    Content to analyze:
    """
    ${text}
    """
  `;

    let response;
    try {
        response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        whatTheyDo: { type: Type.ARRAY, items: { type: Type.STRING } },
                        keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                        signals: { type: Type.ARRAY, items: { type: Type.STRING } },
                        sources: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    url: { type: Type.STRING },
                                    status: { type: Type.NUMBER },
                                    success: { type: Type.BOOLEAN },
                                    timestamp: { type: Type.STRING },
                                },
                                required: ["url", "status", "success", "timestamp"],
                            },
                        },
                    },
                    required: ["summary", "whatTheyDo", "keywords", "signals", "sources"],
                },
            }
        });
    } catch (err: any) {
        // Determine the type of failure and throw specific internal error classes
        const status = err?.status || err?.response?.status;
        if (status && status >= 500) {
            throw new LlmUpstreamError(`Upstream Gemini API error: ${status}`);
        } else if (err.message && (err.message.includes("fetch") || err.message.includes("Network"))) {
            throw new LlmUpstreamError(`Network connectivity issue to LLM API`);
        } else {
            // 4xx errors (authentication, bad request, quota exceeded) should not be retried.
            throw new Error(`Non-retriable LLM error: ${err.message}`);
        }
    }

    const rawText = response.text;
    if (!rawText) {
        throw new Error("LLM returned empty response object.");
    }

    // Parse safety boundary
    let parsedObject;
    try {
        // If Gemini Structured Outputs gives back wrapped markdown, clean it.
        let jsonString = rawText;
        if (jsonString.startsWith("\`\`\`json")) {
            jsonString = jsonString.replace(/^\`\`\`json\n/, "").replace(/\n\`\`\`$/, "");
        }
        parsedObject = JSON.parse(jsonString);
    } catch (err) {
        console.error(`[Extractor] Failed to JSON Parse LLM output. Raw: ${rawText.substring(0, 50)}...`);
        throw new Error("JSON_PARSE_FAILED");
    }

    // Runtime schema validation via Zod
    return validateEnrichmentData(parsedObject);
}
