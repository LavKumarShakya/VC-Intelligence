"use client";

import { useMemo } from "react";
import { Filter, X } from "lucide-react";
import { Company, Stage } from "@/types";
import { Button } from "../ui/Button";

interface CompanyFiltersProps {
    companies: Company[];
    activeFilters: {
        industry: string;
        stage: string;
        location: string;
    };
    onFilterChange: (key: string, value: string) => void;
    onClearFilters: () => void;
}

export function CompanyFilters({ companies, activeFilters, onFilterChange, onClearFilters }: CompanyFiltersProps) {
    // Extract unique values from data for dropdowns
    const industries = useMemo(() => Array.from(new Set(companies.map(c => c.industry))).sort(), [companies]);
    const stages = useMemo(() => Array.from(new Set(companies.map(c => c.stage))).sort(), [companies]);
    const locations = useMemo(() => Array.from(new Set(companies.map(c => c.location))).sort(), [companies]);

    const hasActiveFilters = activeFilters.industry || activeFilters.stage || activeFilters.location;

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-surface p-4 rounded-xl border border-border shadow-soft">
            <div className="flex items-center gap-2 text-text-muted font-medium text-sm">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
            </div>

            <div className="flex flex-1 flex-wrap items-center gap-3">
                <select
                    value={activeFilters.industry}
                    onChange={(e) => onFilterChange("industry", e.target.value)}
                    className="h-9 px-3 py-1 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-main appearance-none min-w-[140px] shadow-sm cursor-pointer"
                >
                    <option value="">All Industries</option>
                    {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>

                <select
                    value={activeFilters.stage}
                    onChange={(e) => onFilterChange("stage", e.target.value)}
                    className="h-9 px-3 py-1 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-main appearance-none min-w-[140px] shadow-sm cursor-pointer"
                >
                    <option value="">All Stages</option>
                    {stages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                </select>

                <select
                    value={activeFilters.location}
                    onChange={(e) => onFilterChange("location", e.target.value)}
                    className="h-9 px-3 py-1 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-main appearance-none min-w-[140px] shadow-sm cursor-pointer"
                >
                    <option value="">All Locations</option>
                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
            </div>

            {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-text-muted hover:text-red-500 shrink-0">
                    <X className="w-4 h-4 mr-1.5" />
                    Clear
                </Button>
            )}
        </div>
    );
}
