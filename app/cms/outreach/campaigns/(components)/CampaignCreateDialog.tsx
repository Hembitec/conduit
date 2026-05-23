"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import {
    Plus,
    Eye,
    Mail,
    Reply,
    User,
    Users,
    Tag,
    FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { renderPreview } from "../../templates/(components)/TemplateEditor";

// ─── Constants ───────────────────────────────────────────────────

const DEFAULT_SENDER_NAME = "Remna Design";
const DEFAULT_SENDER_EMAIL = "contact@mail.remnadesign.pro";

// ─── Component ───────────────────────────────────────────────────

interface CampaignCreateDialogProps {
    disabled?: boolean;
}

export function CampaignCreateDialog({ disabled }: CampaignCreateDialogProps) {
    const templates = useQuery(api.emailTemplates.getTemplatesByUser);
    const leadStats = useQuery(api.leads.getLeadStats);
    const categories = useQuery(api.leads.getLeadCategories) ?? [];
    const folders = useQuery(api.leadFolders.getFoldersByUser) ?? [];
    const createCampaign = useMutation(api.campaigns.createCampaign);

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [templateId, setTemplateId] = useState("");
    const [senderName, setSenderName] = useState(DEFAULT_SENDER_NAME);
    const [senderEmail, setSenderEmail] = useState(DEFAULT_SENDER_EMAIL);
    const [replyToEmail, setReplyToEmail] = useState("");
    const [targetStatus, setTargetStatus] = useState("new");
    const [targetCategory, setTargetCategory] = useState<string>("__all__");
    const [targetFolderId, setTargetFolderId] = useState<string>("__all__");
    const [rateLimit, setRateLimit] = useState("60");
    const [creating, setCreating] = useState(false);

    // Reactive lead preview based on current filter selections
    const leadPreview = useQuery(
        api.leads.getMatchingLeadPreview,
        targetStatus
            ? {
                  status: targetStatus,
                  category: targetCategory === "__all__" ? undefined : targetCategory,
                  folderId:
                      targetFolderId && targetFolderId !== "__all__"
                          ? (targetFolderId as Id<"leadFolders">)
                          : undefined,
              }
            : "skip"
    );

    // Selected template for preview
    const selectedTemplate = useMemo(() => {
        if (!templates || !templateId) return null;
        return templates.find((t) => t._id === templateId) ?? null;
    }, [templates, templateId]);

    const resetForm = () => {
        setName("");
        setTemplateId("");
        setSenderName(DEFAULT_SENDER_NAME);
        setSenderEmail(DEFAULT_SENDER_EMAIL);
        setReplyToEmail("");
        setTargetStatus("new");
        setTargetCategory("__all__");
        setTargetFolderId("__all__");
        setRateLimit("60");
    };

    const handleCreate = async () => {
        if (
            !name.trim() ||
            !templateId ||
            !senderName.trim() ||
            !senderEmail.trim()
        ) {
            toast.error("Please fill in all required fields");
            return;
        }
        if ((leadPreview?.count ?? 0) === 0) {
            toast.error("No leads match the current filters");
            return;
        }
        setCreating(true);
        try {
            await createCampaign({
                name: name.trim(),
                templateId: templateId as Id<"emailTemplates">,
                senderName: senderName.trim(),
                senderEmail: senderEmail.trim(),
                replyToEmail: replyToEmail.trim() || undefined,
                targetLeadStatus: targetStatus,
                targetCategory:
                    targetCategory === "__all__" ? undefined : targetCategory,
                targetFolderId:
                    targetFolderId && targetFolderId !== "__all__"
                        ? (targetFolderId as Id<"leadFolders">)
                        : undefined,
                rateLimitPerHour: parseInt(rateLimit) || 60,
            });
            toast.success("Campaign created");
            setOpen(false);
            resetForm();
        } catch (e) {
            const msg =
                e instanceof Error ? e.message : "Failed to create campaign";
            toast.error(msg);
        } finally {
            setCreating(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(o) => {
                setOpen(o);
                if (!o) resetForm();
            }}
        >
            <DialogTrigger asChild>
                <Button className="gap-2" disabled={disabled}>
                    <Plus className="h-4 w-4" />
                    New Campaign
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-serif text-xl">
                        Create Campaign
                    </DialogTitle>
                    <DialogDescription>
                        Configure your outreach campaign — preview leads and
                        email before launching.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-5 mt-2">
                    {/* Campaign Name */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="campaign-name">Campaign Name</Label>
                        <Input
                            id="campaign-name"
                            placeholder="e.g., Q2 SaaS Outreach"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* ── Targeting Section ── */}
                    <div className="rounded-lg border border-border/60 bg-muted/10 p-4 flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            Lead Targeting
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* Status filter */}
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs text-muted-foreground">
                                    Status
                                </Label>
                                <Select
                                    value={targetStatus}
                                    onValueChange={setTargetStatus}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new">
                                            New ({leadStats?.new ?? 0})
                                        </SelectItem>
                                        <SelectItem value="contacted">
                                            Contacted (
                                            {leadStats?.contacted ?? 0})
                                        </SelectItem>
                                        <SelectItem value="replied">
                                            Replied ({leadStats?.replied ?? 0})
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Category filter */}
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Tag className="h-3 w-3" />
                                    Category
                                </Label>
                                <Select
                                    value={targetCategory}
                                    onValueChange={setTargetCategory}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">
                                            All categories
                                        </SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Folder filter */}
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                    <FolderOpen className="h-3 w-3" />
                                    Folder
                                </Label>
                                <Select
                                    value={targetFolderId}
                                    onValueChange={setTargetFolderId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All folders" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">
                                            All folders
                                        </SelectItem>
                                        {folders.map((f) => (
                                            <SelectItem
                                                key={f._id}
                                                value={f._id}
                                            >
                                                {f.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Matching lead preview */}
                        <div className="rounded-md border border-border/40 bg-card p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge
                                    variant={
                                        (leadPreview?.count ?? 0) > 0
                                            ? "default"
                                            : "secondary"
                                    }
                                    className="text-xs"
                                >
                                    {leadPreview?.count ?? 0} leads match
                                </Badge>
                            </div>
                            {leadPreview &&
                            leadPreview.samples.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {leadPreview.samples.map((l) => (
                                        <Badge
                                            key={l._id}
                                            variant="outline"
                                            className="text-[11px] font-normal"
                                        >
                                            {l.name
                                                ? `${l.name} (${l.email})`
                                                : l.email}
                                        </Badge>
                                    ))}
                                    {leadPreview.count > 5 && (
                                        <Badge
                                            variant="outline"
                                            className="text-[11px] font-normal text-muted-foreground"
                                        >
                                            +{leadPreview.count - 5} more
                                        </Badge>
                                    )}
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground">
                                    No leads match the current filter
                                    combination.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── Email Template + Preview ── */}
                    <div className="flex flex-col gap-3">
                        <Label>Email Template</Label>
                        <Select
                            value={templateId}
                            onValueChange={setTemplateId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                            <SelectContent>
                                {(templates ?? []).map((t) => (
                                    <SelectItem key={t._id} value={t._id}>
                                        {t.name} — {t.subject}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Live email preview */}
                        {selectedTemplate && (
                            <div className="rounded-lg border border-border/60 bg-card p-4 flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                    <Eye className="h-3.5 w-3.5" />
                                    <span className="uppercase tracking-wider">
                                        Email Preview
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className="text-[9px]"
                                    >
                                        Sample data
                                    </Badge>
                                </div>
                                <Separator />
                                <div className="text-xs text-muted-foreground">
                                    <span className="font-medium text-foreground">
                                        From:
                                    </span>{" "}
                                    {senderName} &lt;{senderEmail}&gt;
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-0.5">
                                        Subject
                                    </p>
                                    <p className="text-sm font-medium">
                                        {renderPreview(
                                            selectedTemplate.subject
                                        )}
                                    </p>
                                </div>
                                <Separator />
                                <div className="rounded-md border bg-background overflow-hidden">
                                    {selectedTemplate.bodyMode === "text" ? (
                                        <div className="p-4 text-sm whitespace-pre-wrap" style={{ minHeight: "200px" }}>
                                            {renderPreview(selectedTemplate.body)}
                                        </div>
                                    ) : (
                                        <iframe
                                            srcDoc={renderPreview(
                                                selectedTemplate.body
                                            )}
                                            title="Email preview"
                                            className="w-full border-0"
                                            style={{ minHeight: "200px" }}
                                            sandbox="allow-same-origin"
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Sender Identity ── */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label
                                htmlFor="c-sender-name"
                                className="text-xs flex items-center gap-1"
                            >
                                <User className="h-3 w-3" />
                                Sender Name
                            </Label>
                            <Input
                                id="c-sender-name"
                                placeholder="Your Name"
                                value={senderName}
                                onChange={(e) => setSenderName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label
                                htmlFor="c-sender-email"
                                className="text-xs flex items-center gap-1"
                            >
                                <Mail className="h-3 w-3" />
                                Sender Email
                            </Label>
                            <Input
                                id="c-sender-email"
                                type="email"
                                placeholder="you@domain.com"
                                value={senderEmail}
                                onChange={(e) => setSenderEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Reply-To Email */}
                    <div className="flex flex-col gap-1.5">
                        <Label
                            htmlFor="c-reply-to"
                            className="text-xs flex items-center gap-1"
                        >
                            <Reply className="h-3 w-3" />
                            Reply-To Email
                            <Badge variant="secondary" className="text-[9px] ml-1">Optional</Badge>
                        </Label>
                        <Input
                            id="c-reply-to"
                            type="email"
                            placeholder="replies@yourdomain.com"
                            value={replyToEmail}
                            onChange={(e) => setReplyToEmail(e.target.value)}
                        />
                        <p className="text-[11px] text-muted-foreground">
                            {replyToEmail.trim()
                                ? `Replies will go to: ${replyToEmail.trim()}`
                                : `Replies will go to the sender email: ${senderEmail}`}
                        </p>
                    </div>

                    {/* ── Rate Limit ── */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="c-rate-limit" className="text-xs">
                            Emails per Hour
                        </Label>
                        <Input
                            id="c-rate-limit"
                            type="number"
                            min="1"
                            max="300"
                            value={rateLimit}
                            onChange={(e) => setRateLimit(e.target.value)}
                        />
                        {parseInt(rateLimit) > 0 && (
                            <p className="text-[11px] text-muted-foreground">
                                ≈{" "}
                                {Math.max(
                                    1,
                                    Math.floor(parseInt(rateLimit) / 12)
                                )}{" "}
                                emails every 5 minutes
                            </p>
                        )}
                    </div>

                    {/* ── Actions ── */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-border/40">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={
                                creating || (leadPreview?.count ?? 0) === 0
                            }
                        >
                            {creating
                                ? "Creating..."
                                : `Create Campaign (${leadPreview?.count ?? 0} leads)`}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
