"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { FolderOpen, Plus, X, Check } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

/**
 * Renders dynamic folder links inside the sidebar's Outreach group.
 * Shows a divider, folder links with lead counts, and a "New Folder" inline form.
 */
export function FolderNav({ pathname }: { pathname: string }) {
    const folders = useQuery(api.leadFolders.getFoldersByUser)
    const createFolder = useMutation(api.leadFolders.createFolder)
    const [showNew, setShowNew] = useState(false)
    const [newName, setNewName] = useState("")
    const [creating, setCreating] = useState(false)

    if (!folders || folders.length === 0) {
        if (!showNew) {
            return (
                <button
                    onClick={() => setShowNew(true)}
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mt-1"
                >
                    <Plus className="h-3 w-3" />
                    New Folder
                </button>
            )
        }
    }

    const handleCreate = async () => {
        if (!newName.trim()) return
        setCreating(true)
        try {
            await createFolder({ name: newName.trim() })
            setNewName("")
            setShowNew(false)
            toast.success("Folder created")
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to create folder")
        } finally {
            setCreating(false)
        }
    }

    const isActive = (folderId: string) =>
        pathname === `/cms/outreach/leads` &&
        new URLSearchParams(window.location.search).get("folder") === folderId

    return (
        <>
            {/* Divider */}
            {folders && folders.length > 0 && (
                <div className="my-1 mx-3 border-t border-border/40" />
            )}

            {/* Folder links */}
            {folders?.map((folder) => (
                <Link
                    key={folder._id}
                    href={`/cms/outreach/leads?folder=${folder._id}`}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                        isActive(folder._id)
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                >
                    <FolderOpen className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{folder.name}</span>
                    <span className="text-[10px] tabular-nums opacity-60">
                        {folder.leadCount}
                    </span>
                </Link>
            ))}

            {/* New folder inline form */}
            {showNew ? (
                <div className="flex items-center gap-1 px-2 mt-1">
                    <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Folder name"
                        className="h-7 text-xs"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleCreate()
                            if (e.key === "Escape") { setShowNew(false); setNewName("") }
                        }}
                        disabled={creating}
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 shrink-0"
                        onClick={handleCreate}
                        disabled={creating || !newName.trim()}
                    >
                        <Check className="h-3 w-3" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 shrink-0"
                        onClick={() => { setShowNew(false); setNewName("") }}
                        disabled={creating}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            ) : (
                <button
                    onClick={() => setShowNew(true)}
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mt-1"
                >
                    <Plus className="h-3 w-3" />
                    New Folder
                </button>
            )}
        </>
    )
}
