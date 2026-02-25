"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Download, Building2, ExternalLink, ChevronRight, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/components/ui/Toast";
import { StorageUtility } from "@/lib/storage";
import { downloadCSV, formatDate } from "@/lib/utils";
import { CompanyList, Company } from "@/types";
import { MOCK_COMPANIES } from "@/data/mockCompanies";

export default function ListsPage() {
    const [lists, setLists] = useState<CompanyList[]>([]);
    const [newListTitle, setNewListTitle] = useState("");
    const [activeListId, setActiveListId] = useState<string | null>(null);

    useEffect(() => {
        const savedLists = StorageUtility.getItem<CompanyList[]>("vc-lists") || [];
        setLists(savedLists);
        if (savedLists.length > 0 && !activeListId) {
            setActiveListId(savedLists[0].id);
        }
    }, [activeListId]);

    const saveLists = (newLists: CompanyList[]) => {
        setLists(newLists);
        StorageUtility.setItem("vc-lists", newLists);
    };

    const handleCreateList = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListTitle.trim()) return;

        const newList: CompanyList = {
            id: `list-${Date.now()}`,
            name: newListTitle.trim(),
            companyIds: [],
            createdAt: new Date().toISOString()
        };

        saveLists([...lists, newList]);
        setNewListTitle("");
        setActiveListId(newList.id);
        toast("List created successfully", "success");
    };

    const handleDeleteList = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = lists.filter(l => l.id !== id);
        saveLists(updated);

        if (activeListId === id) {
            setActiveListId(updated.length > 0 ? updated[0].id : null);
        }
        toast("List deleted", "info");
    };

    const handleRemoveCompany = (listId: string, companyId: string) => {
        const updated = lists.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    companyIds: list.companyIds.filter(id => id !== companyId)
                };
            }
            return list;
        });
        saveLists(updated);
        toast("Company removed from list", "info");
    };

    const handleExportJSON = (list: CompanyList) => {
        const listCompanies = list.companyIds
            .map(id => MOCK_COMPANIES.find(c => c.id === id))
            .filter(Boolean) as Company[];

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listCompanies, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${list.name.replace(/\s+/g, '-').toLowerCase()}-export.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        toast("JSON Export started", "success");
    };

    const handleExportCSV = (list: CompanyList) => {
        const listCompanies = list.companyIds
            .map(id => MOCK_COMPANIES.find(c => c.id === id))
            .filter(Boolean) as Company[];

        // Flatten data for CSV
        const csvData = listCompanies.map(c => ({
            ID: c.id,
            Name: c.name,
            Industry: c.industry,
            Stage: c.stage,
            Location: c.location,
            Website: c.website,
            Founded: c.founded,
            Signals: c.signalsCount,
            LastEnriched: c.lastEnriched || ""
        }));

        downloadCSV(csvData, `${list.name.replace(/\s+/g, '-').toLowerCase()}-export`);
        toast("CSV Export started", "success");
    };

    const activeList = lists.find(l => l.id === activeListId);
    const activeListCompanies = activeList?.companyIds
        .map(id => MOCK_COMPANIES.find(c => c.id === id))
        .filter(Boolean) as Company[] || [];

    return (
        <div className="space-y-6 min-h-[calc(100vh-6rem)] flex flex-col">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-text-main">Lists</h1>
                <p className="text-text-muted text-sm mt-1">Manage and export your saved company collections.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1">

                {/* Sidebar: List Management */}
                <div className="md:col-span-1 border-r border-border pr-6 space-y-6 flex flex-col max-h-[calc(100vh-140px)] sticky top-6">
                    <form onSubmit={handleCreateList} className="flex gap-2">
                        <Input
                            placeholder="New list name..."
                            value={newListTitle}
                            onChange={e => setNewListTitle(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={!newListTitle.trim()}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </form>

                    <div className="space-y-2 overflow-y-auto flex-1 pb-4">
                        {lists.length === 0 ? (
                            <div className="text-center py-8 px-4 border border-dashed border-border rounded-xl">
                                <ListTodo className="w-6 h-6 text-text-muted mx-auto mb-2 opacity-50" />
                                <p className="text-sm text-text-muted">No lists created yet.</p>
                            </div>
                        ) : (
                            lists.map(list => (
                                <div
                                    key={list.id}
                                    onClick={() => setActiveListId(list.id)}
                                    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border ${activeListId === list.id
                                            ? "bg-primary/10 border-primary/20 text-primary"
                                            : "bg-surface border-transparent hover:border-border text-text-main hover:bg-background"
                                        }`}
                                >
                                    <div className="overflow-hidden flex-1 pr-2">
                                        <p className="font-medium text-sm truncate">{list.name}</p>
                                        <p className="text-xs opacity-70 mt-0.5">{list.companyIds.length} companies</p>
                                    </div>
                                    <div className="flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`h-6 w-6 ${activeListId === list.id ? "hover:bg-primary/20 hover:text-primary" : "text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"}`}
                                            onClick={(e) => handleDeleteList(list.id, e)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Content: Active List Companies */}
                <div className="md:col-span-3">
                    {!activeList ? (
                        <div className="h-full flex items-center justify-center min-h-[400px]">
                            <EmptyState
                                icon={<ListTodo className="w-8 h-8" />}
                                title="Select or create a list"
                                description="Organize companies into lists to export data, track progress, or share with your team."
                            />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-4 md:p-6 rounded-xl border border-border shadow-sm">
                                <div>
                                    <h2 className="text-xl font-semibold text-text-main flex items-center gap-2">
                                        {activeList.name}
                                        <Badge variant="blue" className="ml-2 font-medium">{activeList.companyIds.length}</Badge>
                                    </h2>
                                    <p className="text-sm text-text-muted mt-1">
                                        Created {formatDate(activeList.createdAt)}
                                    </p>
                                </div>

                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button
                                        variant="outline"
                                        className="flex-1 sm:flex-none bg-background"
                                        onClick={() => handleExportJSON(activeList)}
                                        disabled={activeList.companyIds.length === 0}
                                    >
                                        JSON
                                        <Download className="w-4 h-4 ml-2" />
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="flex-1 sm:flex-none"
                                        onClick={() => handleExportCSV(activeList)}
                                        disabled={activeList.companyIds.length === 0}
                                    >
                                        CSV
                                        <Download className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>

                            {activeListCompanies.length === 0 ? (
                                <div className="bg-surface rounded-xl border border-border p-12 mt-6">
                                    <EmptyState
                                        icon={<Building2 className="w-8 h-8" />}
                                        title="List is empty"
                                        description="You haven't added any companies to this list yet. Go to the Companies directory to start building your list."
                                        action={
                                            <Link href="/companies">
                                                <Button>Browse Companies</Button>
                                            </Link>
                                        }
                                    />
                                </div>
                            ) : (
                                <div className="bg-surface rounded-xl border border-border shadow-card overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm whitespace-nowrap">
                                            <thead className="bg-background border-b border-border text-text-muted">
                                                <tr>
                                                    <th className="px-6 py-4 font-medium">Company</th>
                                                    <th className="px-6 py-4 font-medium">Industry</th>
                                                    <th className="px-6 py-4 font-medium">Stage</th>
                                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {activeListCompanies.map((company) => (
                                                    <tr key={company.id} className="hover:bg-background/50 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-text-main">
                                                                    {company.name}
                                                                </span>
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
                                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                                                                    onClick={() => handleRemoveCompany(activeList.id, company.id)}
                                                                >
                                                                    Remove
                                                                </Button>
                                                                <Link href={`/companies/${company.id}`}>
                                                                    <Button variant="secondary" size="sm" className="bg-background">
                                                                        <ChevronRight className="w-4 h-4" />
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
