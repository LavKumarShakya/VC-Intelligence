"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { StickyNote, Trash2, Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { Note } from "@/types";
import { StorageUtility } from "@/lib/storage";

export function NotesSection({ companyId }: { companyId: string }) {
    const storageKey = `vc-notes-${companyId}`;
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState("");

    useEffect(() => {
        const savedNotes = StorageUtility.getItem<Note[]>(storageKey) || [];
        setNotes(savedNotes);
    }, [storageKey]);

    const handleAddNote = () => {
        if (!newNote.trim()) return;

        const note: Note = {
            id: `note-${Date.now()}`,
            companyId,
            content: newNote.trim(),
            createdAt: new Date().toISOString()
        };

        const updatedNotes = [note, ...notes];
        setNotes(updatedNotes);
        StorageUtility.setItem(storageKey, updatedNotes);
        setNewNote("");
    };

    const handleDeleteNote = (id: string) => {
        const updatedNotes = notes.filter(n => n.id !== id);
        setNotes(updatedNotes);
        StorageUtility.setItem(storageKey, updatedNotes);
    };

    return (
        <div className="bg-surface rounded-xl border border-border shadow-card overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-border bg-background/50 flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-semibold text-text-main tracking-tight">Private Notes</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface">
                {notes.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-text-muted text-sm pb-8">
                        <StickyNote className="w-8 h-8 opacity-20 mb-3" />
                        <p>No notes added yet.</p>
                    </div>
                ) : (
                    notes.map((note) => (
                        <div key={note.id} className="group p-3 rounded-lg bg-background border border-border/50 hover:border-border transition-colors">
                            <p className="text-sm text-text-main whitespace-pre-wrap">{note.content}</p>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                                <span className="text-xs text-text-muted">
                                    {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                                </span>
                                <button
                                    onClick={() => handleDeleteNote(note.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-red-500"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t border-border bg-background/50">
                <div className="flex gap-2">
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleAddNote();
                            }
                        }}
                        placeholder="Add a new note..."
                        className="flex-1 h-10 min-h-[40px] max-h-32 px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-main resize-y transition-shadow"
                    />
                    <Button size="icon" onClick={handleAddNote} disabled={!newNote.trim()}>
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
