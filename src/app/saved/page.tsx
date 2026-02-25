"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookmarkCheck, Search, Trash2, Calendar, Filter as FilterIcon, CornerDownRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";
import { StorageUtility } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import { SavedSearch } from "@/types";

export default function SavedSearchesPage() {
    const router = useRouter();
    const [searches, setSearches] = useState<SavedSearch[]>([]);

    useEffect(() => {
        const saved = StorageUtility.getItem<SavedSearch[]>("vc-saved-searches") || [];
        // Sort newest first
        setSearches(saved.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, []);

    const handleDelete = (id: string) => {
        const updated = searches.filter(s => s.id !== id);
        setSearches(updated);
        StorageUtility.setItem("vc-saved-searches", updated);
        toast("Saved search deleted", "info");
    };

    const handleRunSearch = (search: SavedSearch) => {
        // Construct search params to pass state to /companies
        // For this mock, we'll store active filters briefly in local storage 
        // or just pass the search query via URL since we built the simple search parameter logic

        // As a simple mock approach that works with our current Companies page,
        // passing the query string will initialize the text search. The dropdown filters 
        // would need more URL param handling, but this shows the UX intention.
        if (search.query) {
            router.push(`/companies?search=${encodeURIComponent(search.query)}`);
        } else {
            router.push(`/companies`);
            // In a real app we'd pass ?industry=X&stage=Y to the URL
            toast("Re-applying filter logic simulation...", "info");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-text-main">Saved Searches</h1>
                <p className="text-text-muted text-sm mt-1">Quickly access your frequent queries and custom filter combinations.</p>
            </div>

            {searches.length === 0 ? (
                <div className="bg-surface rounded-xl border border-border p-12 min-h-[400px] flex items-center justify-center">
                    <EmptyState
                        icon={<BookmarkCheck className="w-8 h-8" />}
                        title="No saved searches yet"
                        description="You can save custom filter combinations and keyword searches directly from the Companies directory."
                        action={
                            <Button onClick={() => router.push("/companies")}>
                                Go to Database
                            </Button>
                        }
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searches.map(search => {
                        const hasFilters = search.filters.industry || search.filters.stage || search.filters.location;

                        return (
                            <div
                                key={search.id}
                                className="bg-surface rounded-xl border border-border shadow-soft p-5 group hover:border-primary/50 transition-colors flex flex-col h-full"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2 text-primary font-medium">
                                        {search.query ? (
                                            <><Search className="w-4 h-4" /> Text Query</>
                                        ) : (
                                            <><FilterIcon className="w-4 h-4" /> Filter Preset</>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(search.id);
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex-1 space-y-4">
                                    {search.query && (
                                        <div className="bg-background rounded-lg p-3 border border-border/50">
                                            <p className="text-sm font-medium text-text-main line-clamp-2">
                                                "{search.query}"
                                            </p>
                                        </div>
                                    )}

                                    {hasFilters && (
                                        <div className="space-y-2">
                                            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Applied Filters</span>
                                            <div className="flex flex-wrap gap-2">
                                                {search.filters.industry && (
                                                    <Badge variant="blue">{search.filters.industry}</Badge>
                                                )}
                                                {search.filters.stage && (
                                                    <Badge variant="purple">{search.filters.stage}</Badge>
                                                )}
                                                {search.filters.location && (
                                                    <Badge variant="green">{search.filters.location}</Badge>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                                    <span className="text-xs text-text-muted flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {formatDate(search.createdAt)}
                                    </span>

                                    <Button size="sm" onClick={() => handleRunSearch(search)}>
                                        Run Search
                                        <CornerDownRight className="w-4 h-4 ml-1.5" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
