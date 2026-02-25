import { z } from "zod";
import { EnrichmentResponse } from "@/types/enrichment";

// Defines the exact structure we expect from the LLM
export const EnrichmentResponseSchema = z.object({
    summary: z.string().describe("1-2 sentence summary of the company"),
    whatTheyDo: z.array(z.string()).describe("Bullet points of what the company does"),
    keywords: z.array(z.string()).describe("Keywords associated with the company"),
    signals: z.array(z.string()).describe("Derived signals from the content"),
    sources: z.array(
        z.object({
            url: z.string().url(),
            status: z.number(),
            success: z.boolean(),
            timestamp: z.string(),
        })
    ).describe("Sources used for enrichment"),
});

/**
 * Validates the raw JSON object from the LLM against the Zod schema.
 * Throws an error if the validation fails, ensuring we never return malformed
 * or partial data to the client.
 */
export function validateEnrichmentData(data: unknown): EnrichmentResponse {
    try {
        return EnrichmentResponseSchema.parse(data) as EnrichmentResponse;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("LLM Schema Validation Failed:", error);
        }
        throw new Error("SCHEMA_VALIDATION_FAILED");
    }
}
