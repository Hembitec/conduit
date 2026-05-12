"use client";

import { useState, useMemo } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Lead } from "@/types";
import {
    Search, Trash2, MoreHorizontal, Send, CheckSquare, X,
    Tag, Pencil, ChevronDown, Columns3, FolderOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/EmptyState";
import { EditLeadDrawer } from "./EditLeadDrawer";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCustomFieldKeys, useColumnVisibility, ColumnToggle } from "./ColumnVisibility";

const STATUS_COLORS: Record<string, string> = {
    new: "bg-primary/10 text-primary",
    contacted: "bg-blue-500/10 text-blue-600",
    replied: "bg-emerald-500/10 text-emerald-600",
    bounced: "bg-destructive/10 text-destructive",
    unsubscribed: "bg-muted text-muted-foreground",
};

const STATUS_OPTIONS = ["new", "contacted", "replied", "bounced", "unsubscribed"];

interface FolderWithCount {
    _id: string;
    name: string;
    leadCount: number;
}

interface LeadTableProps {
    leads: Lead[];
    categories: string[];
    folders: FolderWithCount[];
}

export function LeadTable({ leads, categories, folders }: LeadTableProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [selectedIds, setSelectedIds] = useState<Set<Id<"leads">>>(new Set());
    const [editLead, setEditLead] = useState<Lead | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    const deleteLead = useMutation(api.leads.deleteLead);
    const bulkDeleteLeads = useMutation(api.leads.bulkDeleteLeads);
    const bulkUpdateStatus = useMutation(api.leads.bulkUpdateLeadStatus);
    const bulkMoveToFolder = useMutation(api.leads.bulkMoveToFolder);
    const router = useRouter();

    const customFieldKeys = useCustomFieldKeys(leads);
    const { visible, toggle: toggleCol, allColumns } = useColumnVisibility(customFieldKeys);

    const filtered = leads.filter((lead) => {
        const matchesSearch =
            lead.email.toLowerCase().includes(search.toLowerCase()) ||
            (lead.companyName ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (lead.decisionMakerName ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (lead.category ?? "").toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
        const matchesCategory = categoryFilter === "all" || lead.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    // ── Selection helpers ──────────────────────────────────────────
    const toggleOne = (id: Id<"leads">) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleAll = () => {
        if (selectedIds.size === filtered.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filtered.map((l) => l._id)));
        }
    };

    const clearSelection = () => setSelectedIds(new Set());

    // ── Actions ────────────────────────────────────────────────────
    const handleSingleDelete = async (leadId: Id<"leads">) => {
        if (!confirm("Delete this lead?")) return;
        try {
            await deleteLead({ leadId });
            setSelectedIds((prev) => { const next = new Set(prev); next.delete(leadId); return next; });
            toast.success("Lead deleted");
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete lead");
        }
    };

    const handleBulkDelete = async () => {
        setBulkDeleting(true);
        try {
            const ids = Array.from(selectedIds);
            // Batch in chunks of 100 (Convex transaction limit)
            for (let i = 0; i < ids.length; i += 100) {
                const chunk = ids.slice(i, i + 100);
                await bulkDeleteLeads({ leadIds: chunk });
            }
            toast.success(`Deleted ${ids.length} lead${ids.length !== 1 ? "s" : ""}`);
            setSelectedIds(new Set());
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete leads");
        } finally {
            setBulkDeleting(false);
            setDeleteConfirmOpen(false);
        }
    };

    const handleBulkStatusChange = async (status: string) => {
        const ids = Array.from(selectedIds);
        try {
            for (let i = 0; i < ids.length; i += 100) {
                const chunk = ids.slice(i, i + 100);
                await bulkUpdateStatus({ leadIds: chunk, status });
            }
            toast.success(`Updated ${ids.length} lead${ids.length !== 1 ? "s" : ""} to "${status}"`);
            setSelectedIds(new Set());
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to update status");
        }
    };

    const handleBulkMoveToFolder = async (folderId: Id<"leadFolders"> | undefined) => {
        const ids = Array.from(selectedIds);
        try {
            for (let i = 0; i < ids.length; i += 100) {
                const chunk = ids.slice(i, i + 100);
                await bulkMoveToFolder({ leadIds: chunk, folderId });
            }
            const label = folderId
                ? folders.find((f) => f._id === folderId)?.name ?? "folder"
                : "unfiled";
            toast.success(`Moved ${ids.length} lead${ids.length !== 1 ? "s" : ""} to ${label}`);
            setSelectedIds(new Set());
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to move leads");
        }
    };

    const goToCompose = (ids: Id<"leads">[]) => {
        const query = ids.join(",");
        router.push(`/cms/outreach/compose?leads=${encodeURIComponent(query)}`);
    };

    const openEdit = (lead: Lead) => {
        setEditLead(lead);
        setEditOpen(true);
    };

    if (leads.length === 0) {
        return (
            <EmptyState
                title="No leads yet"
                description="Import a CSV file or add leads manually to get started with outreach."
            />
        );
    }

    const allFilteredSelected = filtered.length > 0 && selectedIds.size === filtered.length;
    const someSelected = selectedIds.size > 0;

    return (
        <div className="flex flex-col gap-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, company, or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                        <SelectItem value="bounced">Bounced</SelectItem>
                        <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                    </SelectContent>
                </Select>
                {categories.length > 0 && (
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[180px]">
                            <Tag className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                <ColumnToggle allColumns={allColumns} visible={visible} onToggle={toggleCol} />
            </div>

            {/* Selection action bar */}
            {someSelected && (
                <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5">
                    <CheckSquare className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-medium">
                        {selectedIds.size} lead{selectedIds.size !== 1 ? "s" : ""} selected
                    </span>
                    <div className="ml-auto flex items-center gap-2">
                        <Button
                            size="sm"
                            className="gap-1.5 h-8"
                            onClick={() => goToCompose(Array.from(selectedIds))}
                        >
                            <Send className="h-3.5 w-3.5" />
                            Compose
                        </Button>
                        {/* Bulk status change */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="secondary" className="gap-1.5 h-8">
                                    Status
                                    <ChevronDown className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {STATUS_OPTIONS.map((s) => (
                                    <DropdownMenuItem
                                        key={s}
                                        onClick={() => handleBulkStatusChange(s)}
                                        className="capitalize"
                                    >
                                        Mark as {s}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {/* Bulk move to folder */}
                        {folders.length > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="secondary" className="gap-1.5 h-8">
                                        <FolderOpen className="h-3.5 w-3.5" />
                                        Move to
                                        <ChevronDown className="h-3 w-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {folders.map((f) => (
                                        <DropdownMenuItem
                                            key={f._id}
                                            onClick={() => handleBulkMoveToFolder(f._id as Id<"leadFolders">)}
                                        >
                                            <FolderOpen className="h-4 w-4 mr-2" />
                                            {f.name} ({f.leadCount})
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => handleBulkMoveToFolder(undefined)}
                                    >
                                        Remove from folder
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        {/* Bulk delete */}
                        <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1.5 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteConfirmOpen(true)}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2"
                            onClick={clearSelection}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            <p className="text-xs text-muted-foreground">
                Showing {filtered.length} of {leads.length} leads
                {someSelected && ` · ${selectedIds.size} selected`}
            </p>

            {/* Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10">
                                <Checkbox
                                    checked={allFilteredSelected}
                                    onCheckedChange={toggleAll}
                                    aria-label="Select all visible leads"
                                />
                            </TableHead>
                            {visible.has("contact") && <TableHead>Contact</TableHead>}
                            {visible.has("company") && <TableHead>Company</TableHead>}
                            {visible.has("category") && <TableHead>Category</TableHead>}
                            {visible.has("email") && <TableHead>Email</TableHead>}
                            {visible.has("phone") && <TableHead>Phone</TableHead>}
                            {visible.has("website") && <TableHead>Website</TableHead>}
                            {visible.has("location") && <TableHead>Location</TableHead>}
                            {visible.has("status") && <TableHead>Status</TableHead>}
                            {visible.has("added") && <TableHead>Added</TableHead>}
                            {customFieldKeys.map((k) => visible.has(`cf:${k}`) && (
                                <TableHead key={k}>{k}</TableHead>
                            ))}
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={99} className="text-center py-8 text-muted-foreground">
                                    No leads match your search
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((lead) => (
                                <TableRow
                                    key={lead._id}
                                    className={selectedIds.has(lead._id) ? "bg-primary/5" : ""}
                                >
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.has(lead._id)}
                                            onCheckedChange={() => toggleOne(lead._id)}
                                            aria-label={`Select ${lead.email}`}
                                        />
                                    </TableCell>
                                    {visible.has("contact") && (
                                        <TableCell className="font-medium">
                                            {lead.decisionMakerName || "—"}
                                            {lead.title && (
                                                <span className="block text-xs text-muted-foreground">
                                                    {lead.title}
                                                </span>
                                            )}
                                        </TableCell>
                                    )}
                                    {visible.has("company") && (
                                        <TableCell>{lead.companyName || "—"}</TableCell>
                                    )}
                                    {visible.has("category") && (
                                        <TableCell>
                                            {lead.category ? (
                                                <Badge variant="outline" className="text-[10px] font-normal">
                                                    {lead.category}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                    )}
                                    {visible.has("email") && (
                                        <TableCell className="text-muted-foreground">{lead.email}</TableCell>
                                    )}
                                    {visible.has("phone") && (
                                        <TableCell className="text-muted-foreground">{lead.phone || "—"}</TableCell>
                                    )}
                                    {visible.has("website") && (
                                        <TableCell className="text-muted-foreground">{lead.website || "—"}</TableCell>
                                    )}
                                    {visible.has("location") && (
                                        <TableCell className="text-muted-foreground">{lead.location || "—"}</TableCell>
                                    )}
                                    {visible.has("status") && (
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={STATUS_COLORS[lead.status] ?? ""}
                                            >
                                                {lead.status}
                                            </Badge>
                                        </TableCell>
                                    )}
                                    {visible.has("added") && (
                                        <TableCell className="text-muted-foreground text-sm">
                                            {format(new Date(lead._creationTime), "MMM d, yyyy")}
                                        </TableCell>
                                    )}
                                    {customFieldKeys.map((k) => visible.has(`cf:${k}`) && (
                                        <TableCell key={k} className="text-muted-foreground">
                                            {lead.customFields?.[k] || "—"}
                                        </TableCell>
                                    ))}
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEdit(lead)}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Edit Lead
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => goToCompose([lead._id])}>
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Send Email
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleSingleDelete(lead._id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit drawer */}
            <EditLeadDrawer
                lead={editLead}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            {/* Bulk delete confirmation dialog */}
            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {selectedIds.size} leads?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. All selected leads and their data
                            will be permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={bulkDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleBulkDelete}
                            disabled={bulkDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {bulkDeleting ? "Deleting..." : `Delete ${selectedIds.size} Leads`}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
