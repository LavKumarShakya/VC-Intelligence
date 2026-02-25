import { ArrowLeft, ExternalLink, BookmarkPlus, BookmarkCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { Company } from "@/types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface CompanyHeaderProps {
    company: Company;
    onSave: () => void;
    onEnrich: () => void;
    isEnriching: boolean;
    hasEnriched: boolean;
    isSaved: boolean;
}

export function CompanyHeader({ company, onSave, onEnrich, isEnriching, hasEnriched, isSaved }: CompanyHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 py-6 border-b border-border">
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl uppercase shrink-0">
                    {company.name.substring(0, 2)}
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-text-main">{company.name}</h1>
                        <Badge variant="blue">{company.industry}</Badge>
                        <Badge variant="gray">{company.stage}</Badge>
                    </div>
                    <a
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-text-muted hover:text-primary transition-colors text-sm"
                    >
                        {company.website.replace(/^https?:\/\//, '')}
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant={isSaved ? "outline" : "secondary"}
                    onClick={onSave}
                    className={`w-full md:w-auto ${isSaved ? "opacity-75" : ""}`}
                    disabled={isSaved}
                >
                    {isSaved ? (
                        <>
                            <BookmarkCheck className="w-4 h-4 mr-2 text-primary" />
                            Saved to List
                        </>
                    ) : (
                        <>
                            <BookmarkPlus className="w-4 h-4 mr-2" />
                            Save to List
                        </>
                    )}
                </Button>
                <Button
                    variant={hasEnriched ? "secondary" : "primary"}
                    onClick={onEnrich}
                    isLoading={isEnriching}
                    className="w-full md:w-auto min-w-[120px]"
                >
                    {!isEnriching && <Sparkles className="w-4 h-4 mr-2" />}
                    {hasEnriched ? "Re-Enrich" : "Enrich"}
                </Button>
            </div>
        </div>
    );
}
