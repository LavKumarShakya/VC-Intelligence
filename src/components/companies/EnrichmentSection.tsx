import { EnrichmentResult } from "@/types";
import { Sparkles, CheckCircle2, TrendingUp, Link as LinkIcon, ExternalLink, Download } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Skeleton } from "../ui/Skeleton";
import { formatDate, downloadCSV, downloadJSON } from "@/lib/utils";
import { Button } from "../ui/Button";

interface EnrichmentSectionProps {
    isLoading: boolean;
    data: any | null;
}

export function EnrichmentSection({ isLoading, data }: EnrichmentSectionProps) {
    if (isLoading) {
        return (
            <div className="bg-surface rounded-xl border border-border shadow-card p-6 min-h-[400px]">
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    <h2 className="text-lg font-semibold text-text-main tracking-tight">AI Enrichment</h2>
                </div>

                <div className="space-y-8 animate-pulse">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </div>

                    <div>
                        <Skeleton className="h-4 w-32 mb-4" />
                        <div className="space-y-3">
                            <Skeleton className="h-3 w-3/4 ml-4" />
                            <Skeleton className="h-3 w-5/6 ml-4" />
                            <Skeleton className="h-3 w-4/5 ml-4" />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-surface rounded-xl border border-border shadow-card p-6 min-h-[200px] flex flex-col items-center justify-center text-center">
                <Sparkles className="w-10 h-10 text-primary/20 mb-4" />
                <h3 className="text-text-main font-medium">Not Enriched Yet</h3>
                <p className="text-sm text-text-muted max-w-sm mt-1">
                    Click the Enrich button above to synthesize data from their website, recent news, and job postings.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-surface rounded-xl border border-primary/20 shadow-card p-6 relative overflow-hidden">
            {/* Decorative gradient background hint */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold text-text-main tracking-tight">AI Enrichment</h2>
                        <span className="text-xs text-text-muted bg-background px-2 py-1 rounded-md ml-2 hidden sm:inline-block">
                            Synthesized {formatDate(data.enrichedAt || new Date().toISOString())}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs px-3"
                            onClick={() => downloadJSON(data, "enrichment-data")}
                        >
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            JSON
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs px-3"
                            onClick={() => {
                                // Formatting the nested array data into a flatter structure for CSV
                                const flatData = [{
                                    Summary: data.summary,
                                    "What They Do": (data.whatTheyDo || []).join("; "),
                                    Keywords: (data.keywords || []).join(", "),
                                    Signals: (data.signals || data.derivedSignals || []).join("; "),
                                    Sources: (data.sources || []).map((s: any) => `${s.url} [Status: ${s.status}]`).join(", ")
                                }];
                                downloadCSV(flatData, "enrichment-data");
                            }}
                        >
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            CSV
                        </Button>
                    </div>
                </div>

                <p className="text-sm text-text-main leading-relaxed mb-8">
                    {data.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-sm font-semibold text-text-main mb-3 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-success" />
                            What They Do
                        </h3>
                        <ul className="space-y-2">
                            {(data.whatTheyDo || []).map((item: string, i: number) => (
                                <li key={i} className="text-sm text-text-muted flex items-start">
                                    <span className="text-primary mr-2 mt-0.5">•</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-text-main mb-3 flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4 text-accent" />
                            Derived Signals
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {(data.signals || data.derivedSignals || []).map((signal: string, i: number) => (
                                <Badge key={i} variant="purple">{signal}</Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                    <div className="flex flex-wrap items-center gap-y-4 justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Keywords</span>
                            <div className="flex flex-wrap gap-1.5">
                                {(data.keywords || []).map((kw: string, i: number) => (
                                    <span key={i} className="text-xs text-text-muted bg-background border border-border px-2 py-0.5 rounded-md">
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
                                <LinkIcon className="w-3 h-3" />
                                Sources
                            </span>
                            <div className="flex gap-2">
                                {(data.sources || []).map((source: any, i: number) => (
                                    <a
                                        key={i}
                                        href={source.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${source.success
                                            ? "bg-primary/5 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
                                            : "bg-background border-border/50 text-text-muted/50 hover:text-text-muted hover:border-border"
                                            }`}
                                        title={`${source.url} - ${source.success ? "Success" : `Failed (${source.status})`}`}
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
