"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Lead } from "@/types";
import { Search, Trash2, MoreHorizontal, Send, CheckSquare, X, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const STATUS_COLORS: Record<string, string> = {
    new: "bg-primary/10 text-primary",
    contacted: "bg-blue-500/10 text-blue-600",
    replied: "bg-emerald-500/10 text-emerald-600",
    bounced: "bg-destructive/10 text-destructive",
    unsubscribed: "bg-muted text-muted-foreground",
};

interface LeadTableProps {
    leads: Lead[];
    categories: string[];
}

export function LeadTable({ leads, categories }: LeadTableProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [selectedIds, setSelectedIds] = useState<Set<Id<"leads">>>(new Set());
    const deleteLead = useMutation(api.leads.deleteLead);
    const router = useRouter();

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
    const handleDelete = async (leadId: Id<"leads">) => {
        if (!confirm("Delete this lead?")) return;
        try {
            await deleteLead({ leadId });
            setSelectedIds((prev) => { const next = new Set(prev); next.delete(leadId); return next; });
            toast.success("Lead deleted");
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete lead");
        }
    };

    // Navigate to full-page Compose with selected lead IDs
    const goToCompose = (ids: Id<"leads">[]) => {
        const query = ids.join(",");
        router.push(`/cms/outreach/compose?leads=${encodeURIComponent(query)}`);
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
                            Compose Email
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
                            <TableHead>Contact</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Added</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                                    <TableCell className="font-medium">
                                        {lead.decisionMakerName || "—"}
                                        {lead.title && (
                                            <span className="block text-xs text-muted-foreground">
                                                {lead.title}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>{lead.companyName || "—"}</TableCell>
                                    <TableCell>
                                        {lead.category ? (
                                            <Badge variant="outline" className="text-xs font-normal">
                                                {lead.category}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{lead.email}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={STATUS_COLORS[lead.status] ?? ""}
                                        >
                                            {lead.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {format(new Date(lead._creationTime), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => goToCompose([lead._id])}
                                                >
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Send Email
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(lead._id)}
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
        </div>
    );
}
