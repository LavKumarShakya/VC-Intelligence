"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SearchX, BookmarkPlus } from "lucide-react";
import { MOCK_COMPANIES } from "@/data/mockCompanies";
import { CompanyFilters } from "@/components/companies/CompanyFilters";
import { CompanyTable } from "@/components/companies/CompanyTable";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/components/ui/Toast";
import { StorageUtility } from "@/lib/storage";
import { Company, CompanyList, SavedSearch } from "@/types";

function CompaniesPageContent() {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") || "";

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [filters, setFilters] = useState({ industry: "", stage: "", location: "" });

    // Update searchQuery if global search redirects here
    useEffect(() => {
        if (initialSearch) {
            setSearchQuery(initialSearch);
        }
    }, [initialSearch]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleClearFilters = () => {
        setFilters({ industry: "", stage: "", location: "" });
        setSearchQuery("");
    };

    const filteredCompanies = useMemo(() => {
        return MOCK_COMPANIES.filter(company => {
            // Free text search across name, industry, desc
            const query = searchQuery.toLowerCase();
            const matchesSearch = !query ||
                company.name.toLowerCase().includes(query) ||
                company.industry.toLowerCase().includes(query) ||
                company.description.toLowerCase().includes(query);

            const matchesIndustry = !filters.industry || company.industry === filters.industry;
            const matchesStage = !filters.stage || company.stage === filters.stage;
            const matchesLocation = !filters.location || company.location === filters.location;

            return matchesSearch && matchesIndustry && matchesStage && matchesLocation;
        });
    }, [searchQuery, filters]);

    const handleSaveSearch = () => {
        if (!searchQuery && !filters.industry && !filters.stage && !filters.location) {
            toast("Add some criteria before saving this search", "warning");
            return;
        }

        const savedSearches = StorageUtility.getItem<SavedSearch[]>("vc-saved-searches") || [];
        const newSearch: SavedSearch = {
            id: `srch-${Date.now()}`,
            query: searchQuery,
            filters,
            createdAt: new Date().toISOString()
        };

        StorageUtility.setItem("vc-saved-searches", [...savedSearches, newSearch]);
        toast("Search saved successfully. View it in the Saved Searches tab.", "success");
    };

    const handleSaveCompany = (company: Company) => {
        // Save to the 'Default' list for simplicity in this mock
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
        toast(`Saved ${company.name} to "Default Data List"`, "success");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-text-main">Company Database</h1>
                    <p className="text-text-muted text-sm mt-1">Discover and track highly enriched startup profiles.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleSaveSearch}>
                        <BookmarkPlus className="w-4 h-4 mr-2" />
                        Save Search
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 border-r border-border pr-6 space-y-6 hidden lg:block h-[calc(100vh-140px)] sticky top-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-text-main">Search</h3>
                        <Input
                            icon={<Search className="w-4 h-4" />}
                            placeholder="Search explicitly..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                        <h3 className="font-semibold text-text-main">Apply Filters</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-text-muted font-medium mb-1.5 block">Industry</label>
                                <select
                                    value={filters.industry}
                                    onChange={(e) => handleFilterChange("industry", e.target.value)}
                                    className="w-full h-9 px-3 py-1 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-main"
                                >
                                    <option value="">All Industries</option>
                                    {Array.from(new Set(MOCK_COMPANIES.map(c => c.industry))).sort().map(ind =>
                                        <option key={ind} value={ind}>{ind}</option>
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-text-muted font-medium mb-1.5 block">Stage</label>
                                <select
                                    value={filters.stage}
                                    onChange={(e) => handleFilterChange("stage", e.target.value)}
                                    className="w-full h-9 px-3 py-1 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-main"
                                >
                                    <option value="">All Stages</option>
                                    {Array.from(new Set(MOCK_COMPANIES.map(c => c.stage))).sort().map(stage =>
                                        <option key={stage} value={stage}>{stage}</option>
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-text-muted font-medium mb-1.5 block">Location</label>
                                <select
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange("location", e.target.value)}
                                    className="w-full h-9 px-3 py-1 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-main"
                                >
                                    <option value="">All Locations</option>
                                    {Array.from(new Set(MOCK_COMPANIES.map(c => c.location))).sort().map(loc =>
                                        <option key={loc} value={loc}>{loc}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    {(searchQuery || filters.industry || filters.stage || filters.location) && (
                        <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 mt-2" onClick={handleClearFilters}>
                            Clear all filters
                        </Button>
                    )}
                </div>

                <div className="lg:col-span-3 space-y-4">
                    {/* Mobile Filters + Search (visible < lg) */}
                    <div className="lg:hidden space-y-4">
                        <Input
                            icon={<Search className="w-4 h-4" />}
                            placeholder="Search companies, keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <CompanyFilters
                            companies={MOCK_COMPANIES}
                            activeFilters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={handleClearFilters}
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm text-text-muted py-2">
                        <span>Showing <span className="font-semibold text-text-main">{filteredCompanies.length}</span> companies</span>
                    </div>

                    {filteredCompanies.length > 0 ? (
                        <CompanyTable companies={filteredCompanies} onSaveCompany={handleSaveCompany} />
                    ) : (
                        <EmptyState
                            icon={<SearchX className="w-8 h-8" />}
                            title="No companies found"
                            description="Your search criteria didn't match any companies in our database. Try adjusting your filters."
                            action={
                                <Button onClick={handleClearFilters}>Clear all filters</Button>
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CompaniesPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
            <CompaniesPageContent />
        </Suspense>
    );
}
