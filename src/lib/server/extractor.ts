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
    
    CRITICAL RULES:
    - Base ALL output ONLY on the provided scraped content below.
    - DO NOT hallucinate or infer from external knowledge.
    - DO NOT include marketing copy, taglines, or filler text.
    - Be concise. Brevity is mandatory.
    
    STRICT OUTPUT LIMITS:
    - summary: Exactly 1-2 sentences. Maximum 30 words total. State what the company does and for whom.
    - whatTheyDo: Exactly 3 bullet points. Each bullet must be 1 sentence, maximum 15 words. No sub-points.
    - keywords: Exactly 3-5 single-word or two-word tags. Examples: "Fintech", "B2B SaaS", "DevTools". No sentences.
    - signals: Maximum 3 items. Only include if explicitly evidenced in the text. Examples: "Active careers page detected", "Enterprise customer logos present". Do NOT list product features as signals.
    - sources: Return EXACTLY this array, unchanged: ${JSON.stringify(sources)}

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
