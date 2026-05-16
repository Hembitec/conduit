"use client";

import { useState, useMemo, use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Send,
    X,
    Eye,
    Users,
    LayoutTemplate,
    User,
    Mail,
    Reply,
    Tag,
    FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { renderPreview } from "../templates/(components)/TemplateEditor";

interface ComposePageProps {
    searchParams: Promise<{ leads?: string }>;
}

export default function ComposePage({ searchParams }: ComposePageProps) {
    const resolvedParams = use(searchParams);
    const preselectedIds = useMemo(() => {
        if (!resolvedParams.leads) return [];
        return resolvedParams.leads.split(",").filter(Boolean);
    }, [resolvedParams.leads]);

    const allLeads = useQuery(api.leads.getLeadsByUser, {});
    const templates = useQuery(api.emailTemplates.getTemplatesByUser);
    const categories = useQuery(api.leads.getLeadCategories) ?? [];
    const folders = useQuery(api.leadFolders.getFoldersByUser) ?? [];
    const sendToSelected = useMutation(api.campaigns.sendToSelectedLeads);
    const router = useRouter();

    const [selectedIds, setSelectedIds] = useState<Set<string>>(
        new Set(preselectedIds)
    );
    const [templateId, setTemplateId] = useState<string>("");
    const [senderName, setSenderName] = useState("Remna Design");
    const [senderEmail, setSenderEmail] = useState("contact@mail.remnadesign.pro");
    const [replyToEmail, setReplyToEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [showLeadPicker, setShowLeadPicker] = useState(false);
    const [leadSearch, setLeadSearch] = useState("");

    const loading = allLeads === undefined || templates === undefined;

    // Selected lead objects
    const selectedLeads = useMemo(() => {
        if (!allLeads) return [];
        return allLeads.filter((l) => selectedIds.has(l._id));
    }, [allLeads, selectedIds]);

    // Template for preview
    const selectedTemplate = useMemo(() => {
        if (!templates || !templateId) return null;
        return templates.find((t) => t._id === templateId) ?? null;
    }, [templates, templateId]);

    // Filtered leads for the add-more picker
    const filteredLeads = useMemo(() => {
        if (!allLeads) return [];
        return allLeads.filter(
            (l) =>
                !selectedIds.has(l._id) &&
                (l.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
                    (l.decisionMakerName ?? "")
                        .toLowerCase()
                        .includes(leadSearch.toLowerCase()) ||
                    (l.companyName ?? "")
                        .toLowerCase()
                        .includes(leadSearch.toLowerCase()))
        );
    }, [allLeads, selectedIds, leadSearch]);

    const removeLead = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const addLead = (id: string) => {
        setSelectedIds((prev) => new Set(prev).add(id));
        setLeadSearch("");
    };

    const handleSend = async () => {
        if (selectedIds.size === 0) {
            toast.error("Select at least one recipient");
            return;
        }
        if (!templateId) {
            toast.error("Select a template");
            return;
        }
        if (!senderEmail.trim()) {
            toast.error("Sender email is required");
            return;
        }

        setSending(true);
        try {
            const result = await sendToSelected({
                name: `Compose Send — ${new Date().toLocaleDateString()}`,
                templateId: templateId as Id<"emailTemplates">,
                senderName: senderName.trim(),
                senderEmail: senderEmail.trim(),
                replyToEmail: replyToEmail.trim() || undefined,
                leadIds: Array.from(selectedIds) as Id<"leads">[],
            });
            toast.success(
                `Queued ${result.count} email${result.count !== 1 ? "s" : ""} for delivery`
            );
            router.push("/cms/outreach/analytics");
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Send failed");
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <main className="flex flex-col gap-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-[400px]" />
                    <Skeleton className="h-[400px]" />
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col gap-8 p-4 sm:p-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border/50 pb-6">
                <div className="flex flex-col gap-1.5">
                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Outreach
                    </p>
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground">
                            Compose &amp; Send
                        </h1>
                    </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/cms/outreach/leads">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Leads
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* ── Left Column (3/5): Configuration ── */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    {/* Recipients */}
                    <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-card p-6">
                        <div className="flex items-center justify-between mb-2 pb-4 border-b border-border/40">
                            <h2 className="font-serif text-xl font-medium tracking-tight text-foreground flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Recipients
                            </h2>
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-widest">
                                {selectedIds.size} Selected
                            </Badge>
                        </div>
                        <div>
                            {/* Bulk selection controls */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-7"
                                    onClick={() => {
                                        if (!allLeads) return;
                                        setSelectedIds(new Set(allLeads.map((l) => l._id)));
                                    }}
                                    disabled={!allLeads || allLeads.length === 0}
                                >
                                    Select All ({allLeads?.length ?? 0})
                                </Button>
                                {/* Quick status filters */}
                                {["new", "contacted", "replied"].map((status) => {
                                    const count = allLeads?.filter((l) => l.status === status && !selectedIds.has(l._id)).length ?? 0;
                                    if (count === 0) return null;
                                    return (
                                        <Button
                                            key={status}
                                            variant="outline"
                                            size="sm"
                                            className="text-xs h-7 capitalize"
                                            onClick={() => {
                                                if (!allLeads) return;
                                                setSelectedIds((prev) => {
                                                    const next = new Set(prev);
                                                    allLeads.filter((l) => l.status === status).forEach((l) => next.add(l._id));
                                                    return next;
                                                });
                                            }}
                                        >
                                            + {status} ({count})
                                        </Button>
                                    );
                                })}
                                {selectedIds.size > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs h-7 text-destructive hover:text-destructive"
                                        onClick={() => setSelectedIds(new Set())}
                                    >
                                        Clear All
                                    </Button>
                                )}
                            </div>
                            {/* Category quick-select buttons */}
                            {categories.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Tag className="h-3 w-3" />
                                        By category:
                                    </span>
                                    {categories.map((cat) => {
                                        const count = allLeads?.filter(
                                            (l) => l.category === cat && !selectedIds.has(l._id)
                                        ).length ?? 0;
                                        if (count === 0) return null;
                                        return (
                                            <Button
                                                key={cat}
                                                variant="outline"
                                                size="sm"
                                                className="text-xs h-7"
                                                onClick={() => {
                                                    if (!allLeads) return;
                                                    setSelectedIds((prev) => {
                                                        const next = new Set(prev);
                                                        allLeads
                                                            .filter((l) => l.category === cat)
                                                            .forEach((l) => next.add(l._id));
                                                        return next;
                                                    });
                                                }}
                                            >
                                                + {cat} ({count})
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}
                            {/* Folder quick-select */}
                            {folders.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <FolderOpen className="h-3 w-3" />
                                        By folder:
                                    </span>
                                    {folders.map((folder) => {
                                        const folderLeads = allLeads?.filter(
                                            (l) => l.folderId === folder._id && !selectedIds.has(l._id)
                                        );
                                        const count = folderLeads?.length ?? 0;
                                        if (count === 0) return null;
                                        return (
                                            <Button
                                                key={folder._id}
                                                variant="outline"
                                                size="sm"
                                                className="text-xs h-7"
                                                onClick={() => {
                                                    if (!allLeads) return;
                                                    setSelectedIds((prev) => {
                                                        const next = new Set(prev);
                                                        allLeads
                                                            .filter((l) => l.folderId === folder._id)
                                                            .forEach((l) => next.add(l._id));
                                                        return next;
                                                    });
                                                }}
                                            >
                                                + {folder.name} ({count})
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Selected leads */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {selectedLeads.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No recipients selected. Use the buttons above or search below.
                                    </p>
                                ) : (
                                    selectedLeads.map((l) => (
                                        <Badge
                                            key={l._id}
                                            variant="secondary"
                                            className="gap-1.5 pr-1"
                                        >
                                            {l.decisionMakerName
                                                ? `${l.decisionMakerName} (${l.email})`
                                                : l.email}
                                            <button
                                                onClick={() => removeLead(l._id)}
                                                className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                                                aria-label={`Remove ${l.email}`}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))
                                )}
                            </div>

                            {/* Search and add individual leads */}
                            <div className="relative">
                                <Input
                                    placeholder="Search and add more leads..."
                                    value={leadSearch}
                                    onChange={(e) => {
                                        setLeadSearch(e.target.value);
                                        setShowLeadPicker(true);
                                    }}
                                    onFocus={() => setShowLeadPicker(true)}
                                    className="text-sm"
                                />
                                {showLeadPicker && leadSearch && (
                                    <div className="absolute top-full mt-1 left-0 right-0 z-10 bg-popover border rounded-md shadow-md max-h-48 overflow-y-auto">
                                        {filteredLeads.length === 0 ? (
                                            <p className="p-3 text-sm text-muted-foreground">
                                                No matching leads
                                            </p>
                                        ) : (
                                            filteredLeads.slice(0, 10).map((l) => (
                                                <button
                                                    key={l._id}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2"
                                                    onClick={() => {
                                                        addLead(l._id);
                                                        setShowLeadPicker(false);
                                                    }}
                                                >
                                                    <span className="font-medium truncate">
                                                        {l.decisionMakerName || l.email}
                                                    </span>
                                                    {l.decisionMakerName && (
                                                        <span className="text-muted-foreground truncate">
                                                            {l.email}
                                                        </span>
                                                    )}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Template Selection */}
                    <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-card p-6">
                        <div className="flex items-center justify-between mb-2 pb-4 border-b border-border/40">
                            <h2 className="font-serif text-xl font-medium tracking-tight text-foreground flex items-center gap-2">
                                <LayoutTemplate className="h-5 w-5 text-primary" />
                                Email Template
                            </h2>
                        </div>
                        <div>
                            <Select value={templateId} onValueChange={setTemplateId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a template..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {(templates ?? []).map((t) => (
                                        <SelectItem key={t._id} value={t._id}>
                                            {t.name} — {t.subject}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {(templates ?? []).length === 0 && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    No templates yet.{" "}
                                    <Link
                                        href="/cms/outreach/templates/new"
                                        className="text-primary underline"
                                    >
                                        Create one first
                                    </Link>
                                    .
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Sender Identity */}
                    <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-card p-6">
                        <div className="flex items-center justify-between mb-2 pb-4 border-b border-border/40">
                            <div className="flex flex-col gap-1">
                                <h2 className="font-serif text-xl font-medium tracking-tight text-foreground flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Sender Identity
                                </h2>
                                <p className="text-xs text-muted-foreground font-medium">
                                    This is the name and email recipients will see in their inbox
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="compose-name" className="text-xs flex items-center gap-1">
                                        <User className="h-3 w-3" /> Display Name
                                    </Label>
                                    <Input id="compose-name" value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Your Name" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="compose-email" className="text-xs flex items-center gap-1">
                                        <Mail className="h-3 w-3" /> From Email
                                    </Label>
                                    <Input id="compose-email" type="email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} placeholder="you@domain.com" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="compose-reply-to" className="text-xs flex items-center gap-1">
                                    <Reply className="h-3 w-3" /> Reply-To
                                    <Badge variant="secondary" className="text-[9px] ml-1">Optional</Badge>
                                </Label>
                                <Input id="compose-reply-to" type="email" value={replyToEmail} onChange={(e) => setReplyToEmail(e.target.value)} placeholder="replies@yourdomain.com" />
                                <p className="text-[11px] text-muted-foreground">
                                    {replyToEmail.trim() ? `Replies → ${replyToEmail.trim()}` : `Replies → ${senderEmail} (sender email)`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Send Button */}
                    <Button
                        onClick={handleSend}
                        disabled={sending || selectedIds.size === 0 || !templateId}
                        size="lg"
                        className="gap-2 w-full font-serif text-lg tracking-tight h-12"
                    >
                        <Send className="h-5 w-5" />
                        {sending
                            ? "Sending..."
                            : `Send to ${selectedIds.size} Recipient${selectedIds.size !== 1 ? "s" : ""}`}
                    </Button>
                </div>

                {/* ── Right Column (2/5): Live Preview ── */}
                <div className="lg:col-span-2">
                    <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-card p-6 sticky top-4">
                        <div className="flex items-center justify-between mb-2 pb-4 border-b border-border/40">
                            <div className="flex flex-col gap-1">
                                <h2 className="font-serif text-xl font-medium tracking-tight text-foreground flex items-center gap-2">
                                    <Eye className="h-5 w-5 text-primary" />
                                    Email Preview
                                </h2>
                                <p className="text-xs text-muted-foreground font-medium">
                                    How the email will appear in recipients&apos; inbox
                                </p>
                            </div>
                        </div>
                        <div>
                            {!selectedTemplate ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Mail className="h-12 w-12 text-muted-foreground/30 mb-3" />
                                    <p className="text-sm text-muted-foreground">
                                        Select a template to preview
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {/* From / Reply-To lines */}
                                    <div className="text-xs text-muted-foreground space-y-0.5">
                                        <div><span className="font-medium text-foreground">From:</span> {senderName} &lt;{senderEmail}&gt;</div>
                                        {replyToEmail.trim() && <div><span className="font-medium text-foreground">Reply-To:</span> {replyToEmail.trim()}</div>}
                                    </div>
                                    <Separator />
                                    {/* Subject */}
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-0.5">
                                            Subject
                                        </p>
                                        <p className="text-sm font-medium">
                                            {renderPreview(selectedTemplate.subject)}
                                        </p>
                                    </div>
                                    <Separator />
                                    {/* Body */}
                                    <div className="rounded-md border bg-background overflow-hidden">
                                        <iframe
                                            srcDoc={renderPreview(selectedTemplate.body)}
                                            title="Email preview"
                                            className="w-full border-0"
                                            style={{ minHeight: "350px" }}
                                            sandbox="allow-same-origin"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
