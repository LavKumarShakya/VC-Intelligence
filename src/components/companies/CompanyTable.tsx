"use client";

import { useState } from "react";
import Link from "next/link";
import { type Company } from "@/types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ChevronUp, ChevronDown, Plus, ExternalLink, Activity } from "lucide-react";
import { formatDate } from "@/lib/utils";

type SortField = "name" | "industry" | "stage" | "signalsCount" | "lastEnriched";
type SortDirection = "asc" | "desc";

interface CompanyTableProps {
    companies: Company[];
    onSaveCompany: (company: Company) => void;
}

export function CompanyTable({ companies, onSaveCompany }: CompanyTableProps) {
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return <div className="w-4 h-4 opacity-0 group-hover:opacity-30 inline-block ml-1" />;
        return sortDirection === "asc"
            ? <ChevronUp className="w-4 h-4 inline-block ml-1 text-primary" />
            : <ChevronDown className="w-4 h-4 inline-block ml-1 text-primary" />;
    };

    // Sorting logic
    const sortedCompanies = [...companies].sort((a, b) => {
        let comparison = 0;

        if (sortField === "signalsCount") {
            comparison = a.signalsCount - b.signalsCount;
        } else if (sortField === "lastEnriched") {
            const dateA = a.lastEnriched ? new Date(a.lastEnriched).getTime() : 0;
            const dateB = b.lastEnriched ? new Date(b.lastEnriched).getTime() : 0;
            comparison = dateA - dateB;
        } else {
            comparison = String(a[sortField]).localeCompare(String(b[sortField]));
        }

        return sortDirection === "asc" ? comparison : -comparison;
    });

    // Pagination logic
    const totalPages = Math.ceil(sortedCompanies.length / itemsPerPage);
    const paginatedCompanies = sortedCompanies.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="bg-surface rounded-xl border border-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-background border-b border-border text-text-muted">
                        <tr>
                            <th
                                className="px-6 py-4 font-medium tracking-wider cursor-pointer group hover:text-text-main transition-colors"
                                onClick={() => handleSort("name")}
                            >
                                Company {getSortIcon("name")}
                            </th>
                            <th
                                className="px-6 py-4 font-medium tracking-wider cursor-pointer group hover:text-text-main transition-colors"
                                onClick={() => handleSort("industry")}
                            >
                                Industry {getSortIcon("industry")}
                            </th>
                            <th
                                className="px-6 py-4 font-medium tracking-wider cursor-pointer group hover:text-text-main transition-colors"
                                onClick={() => handleSort("stage")}
                            >
                                Stage {getSortIcon("stage")}
                            </th>
                            <th
                                className="px-6 py-4 font-medium tracking-wider cursor-pointer group hover:text-text-main transition-colors text-right"
                                onClick={() => handleSort("signalsCount")}
                            >
                                Signals {getSortIcon("signalsCount")}
                            </th>
                            <th
                                className="px-6 py-4 font-medium tracking-wider cursor-pointer group hover:text-text-main transition-colors text-right"
                                onClick={() => handleSort("lastEnriched")}
                            >
                                Last Enriched {getSortIcon("lastEnriched")}
                            </th>
                            <th className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {paginatedCompanies.map((company) => (
                            <tr key={company.id} className="hover:bg-background/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <Link href={`/companies/${company.id}`} className="font-semibold text-text-main hover:text-primary transition-colors">
                                            {company.name}
                                        </Link>
                                        <a href={company.website} target="_blank" rel="noreferrer" className="text-xs text-text-muted hover:text-accent flex items-center gap-1 mt-0.5">
                                            {company.website.replace(/^https?:\/\//, '')}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-text-main">
                                    {company.industry}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={
                                        company.stage === "Seed" ? "gray" :
                                            company.stage === "Series A" ? "blue" :
                                                company.stage === "Series B" ? "purple" :
                                                    company.stage === "Series C" ? "orange" : "green"
                                    }>
                                        {company.stage}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5 font-medium">
                                        <Activity className="w-4 h-4 text-primary opacity-70" />
                                        <span className={company.signalsCount > 20 ? "text-success" : "text-text-main"}>
                                            {company.signalsCount}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right text-text-muted text-xs">
                                    {company.lastEnriched ? formatDate(company.lastEnriched) : "Never"}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => onSaveCompany(company)}
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Save
                                        </Button>
                                        <Link href={`/companies/${company.id}`}>
                                            <Button variant="primary" size="sm">
                                                View
                                            </Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-background/50">
                    <p className="text-sm text-text-muted">
                        Showing <span className="font-medium text-text-main">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-text-main">{Math.min(currentPage * itemsPerPage, sortedCompanies.length)}</span> of <span className="font-medium text-text-main">{sortedCompanies.length}</span> results
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
