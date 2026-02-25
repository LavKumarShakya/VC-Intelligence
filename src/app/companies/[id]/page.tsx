"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { CompanyHeader } from "@/components/companies/CompanyHeader";
import { OverviewCard } from "@/components/companies/OverviewCard";
import { SignalsTimeline } from "@/components/companies/SignalsTimeline";
import { NotesSection } from "@/components/companies/NotesSection";
import { EnrichmentSection } from "@/components/companies/EnrichmentSection";
import { MOCK_COMPANIES } from "@/data/mockCompanies";
import { Company, EnrichmentResult, CompanyList } from "@/types";
import { StorageUtility } from "@/lib/storage";

export default function CompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();

    // Unwrap parameters
    const { id } = use(params);

    const [company, setCompany] = useState<Company | null>(null);
    const [enrichmentData, setEnrichmentData] = useState<EnrichmentResult | null>(null);
    const [isEnriching, setIsEnriching] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        // Find company from mock
        const found = MOCK_COMPANIES.find(c => c.id === id);
        if (found) {
            setCompany(found);
        }

        // Load enrichment cache
        const cachedEnrichment = StorageUtility.getItem<EnrichmentResult>(`vc-enrichment-${id}`);
        if (cachedEnrichment) {
            setEnrichmentData(cachedEnrichment);
        }

        // Check save status
        const lists = StorageUtility.getItem<CompanyList[]>("vc-lists") || [];
        const isCompanySaved = lists.some(list => list.companyIds.includes(id as string));
        setIsSaved(isCompanySaved);
    }, [id]);

    if (!company) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
                <h2 className="text-xl font-bold text-text-main mb-2">Company not found</h2>
                <p className="text-text-muted mb-6">The company ID you requested doesn't exist.</p>
                <Button onClick={() => router.push("/companies")}>Back to Directory</Button>
            </div>
        );
    }

    const handleSaveCompany = () => {
        const lists = StorageUtility.getItem<CompanyList[]>("vc-lists") || [];
        let defaultList = lists.find(l => l.name === "Default Data List");

        if (!defaultList) {
            defaultList = {
                id: `list-default`,
                name: "Default Data List",
                companyIds: [],
                createdAt: new Date().toISOString()
            };
            lists.push(defaultList);
        }

        if (defaultList.companyIds.includes(company.id)) {
            toast(`${company.name} is already in your list`, "info");
            return;
        }

        defaultList.companyIds.push(company.id);
        StorageUtility.setItem("vc-lists", lists);
        setIsSaved(true);
        toast(`Saved ${company.name} to "Default Data List"`, "success");
    };

    const handleEnrich = async () => {
        setIsEnriching(true);
        toast(`Enriching data for ${company.name}...`, "info", 1500);

        try {
            const response = await fetch("/api/enrich", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ companyId: company.id, website: company.website }),
            });

            const resData = await response.json();

            if (!response.ok) {
                // Fallback error based on specific status codes mapped from the backend plan
                const errorMessage = resData.error ||
                    (response.status === 429 ? "Rate limit exceeded." :
                        response.status === 502 ? "Upstream AI service unavailable." :
                            "Failed to extract structured enrichment data.");
                throw new Error(errorMessage);
            }

            setEnrichmentData(resData);
            StorageUtility.setItem(`vc-enrichment-${company.id}`, resData);
            toast("Enrichment complete", "success");
        } catch (error: any) {
            toast(error.message || "Failed to enrich company data", "warning");
        } finally {
            setIsEnriching(false);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="-ml-3">
                <Button variant="ghost" size="sm" onClick={() => router.push("/companies")} className="text-text-muted hover:text-text-main">
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    Back to Directory
                </Button>
            </div>

            <CompanyHeader
                company={company}
                onSave={handleSaveCompany}
                onEnrich={handleEnrich}
                isEnriching={isEnriching}
                hasEnriched={!!enrichmentData}
                isSaved={isSaved}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <OverviewCard company={company} />
                    <EnrichmentSection isLoading={isEnriching} data={enrichmentData} />
                </div>

                <div className="space-y-6 lg:h-[calc(100vh-200px)] lg:sticky lg:top-24 flex flex-col">
                    <div className="flex-1 min-h-[300px]">
                        <SignalsTimeline signals={company.signals} />
                    </div>
                    <div className="flex-1 min-h-[300px]">
                        <NotesSection companyId={company.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
