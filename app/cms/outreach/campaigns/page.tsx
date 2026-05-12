"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import {
    Megaphone,
    Plus,
    Play,
    Pause,
    Trash2,
    CheckCircle2,
    Clock,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
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
import { EmptyState } from "@/components/EmptyState";
import { format } from "date-fns";

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
    draft: { color: "bg-muted text-muted-foreground", icon: Clock },
    running: { color: "bg-primary/10 text-primary", icon: Play },
    paused: { color: "bg-yellow-500/10 text-yellow-600", icon: Pause },
    completed: { color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle2 },
};

export default function CampaignsPage() {
    const campaigns = useQuery(api.campaigns.getCampaignsByUser);
    const templates = useQuery(api.emailTemplates.getTemplatesByUser);
    const leadStats = useQuery(api.leads.getLeadStats);
    const createCampaign = useMutation(api.campaigns.createCampaign);
    const startCampaign = useMutation(api.campaigns.startCampaign);
    const pauseCampaign = useMutation(api.campaigns.pauseCampaign);
    const deleteCampaign = useMutation(api.campaigns.deleteCampaign);

    const [createOpen, setCreateOpen] = useState(false);
    const [name, setName] = useState("");
    const [templateId, setTemplateId] = useState("");
    const [senderName, setSenderName] = useState("");
    const [senderEmail, setSenderEmail] = useState("");
    const [targetStatus, setTargetStatus] = useState("new");
    const [rateLimit, setRateLimit] = useState("60");
    const [creating, setCreating] = useState(false);

    const resetForm = () => {
        setName("");
        setTemplateId("");
        setSenderName("");
        setSenderEmail("");
        setTargetStatus("new");
        setRateLimit("60");
    };

    const handleCreate = async () => {
        if (!name.trim() || !templateId || !senderName.trim() || !senderEmail.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }
        setCreating(true);
        try {
            await createCampaign({
                name: name.trim(),
                templateId: templateId as Id<"emailTemplates">,
                senderName: senderName.trim(),
                senderEmail: senderEmail.trim(),
                targetLeadStatus: targetStatus,
                rateLimitPerHour: parseInt(rateLimit) || 60,
            });
            toast.success("Campaign created");
            setCreateOpen(false);
            resetForm();
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Failed to create campaign";
            toast.error(msg);
        } finally {
            setCreating(false);
        }
    };

    const handleStart = async (id: Id<"campaigns">) => {
        try {
            await startCampaign({ campaignId: id });
            toast.success("Campaign started");
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Failed to start campaign";
            toast.error(msg);
        }
    };

    const handlePause = async (id: Id<"campaigns">) => {
        try {
            await pauseCampaign({ campaignId: id });
            toast.success("Campaign paused");
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Failed to pause campaign";
            toast.error(msg);
        }
    };

    const handleDelete = async (id: Id<"campaigns">) => {
        if (!confirm("Delete this campaign?")) return;
        try {
            await deleteCampaign({ campaignId: id });
            toast.success("Campaign deleted");
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Failed to delete campaign";
            toast.error(msg);
        }
    };

    if (campaigns === undefined || templates === undefined) {
        return (
            <div className="flex w-full flex-col gap-6">
                <Skeleton className="h-10 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-48 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <main className="flex w-full flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border/50 pb-6 mb-8">
                <div className="flex flex-col gap-1.5">
                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium flex items-center gap-2">
                        <Megaphone className="h-4 w-4" />
                        Outreach
                    </p>
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground">
                            Campaigns
                        </h1>
                        {campaigns !== undefined && (
                            <span className="text-xs font-medium text-muted-foreground rounded-full border border-border/60 bg-muted/20 px-2 py-0.5">
                                {campaigns.length} total
                            </span>
                        )}
                    </div>
                </div>

                {/* Create Campaign Dialog */}
                <Dialog open={createOpen} onOpenChange={(o) => { setCreateOpen(o); if (!o) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2" disabled={templates.length === 0}>
                            <Plus className="h-4 w-4" />
                            New Campaign
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create Campaign</DialogTitle>
                            <DialogDescription>
                                Configure your outreach campaign settings.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 mt-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="campaign-name">Campaign Name</Label>
                                <Input
                                    id="campaign-name"
                                    placeholder="e.g., Q2 Outreach"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Email Template</Label>
                                <Select value={templateId} onValueChange={setTemplateId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templates.map((t) => (
                                            <SelectItem key={t._id} value={t._id}>
                                                {t.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="sender-name">Sender Name</Label>
                                    <Input
                                        id="sender-name"
                                        placeholder="Your Name"
                                        value={senderName}
                                        onChange={(e) => setSenderName(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="sender-email">Sender Email</Label>
                                    <Input
                                        id="sender-email"
                                        type="email"
                                        placeholder="you@domain.com"
                                        value={senderEmail}
                                        onChange={(e) => setSenderEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-2">
                                    <Label>Target Lead Status</Label>
                                    <Select value={targetStatus} onValueChange={setTargetStatus}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">New ({leadStats?.new ?? 0})</SelectItem>
                                            <SelectItem value="contacted">Contacted ({leadStats?.contacted ?? 0})</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="rate-limit">Emails/Hour</Label>
                                    <Input
                                        id="rate-limit"
                                        type="number"
                                        min="1"
                                        max="300"
                                        value={rateLimit}
                                        onChange={(e) => setRateLimit(e.target.value)}
                                    />
                                </div>
                            </div>
                            {parseInt(rateLimit) > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    ≈ {Math.max(1, Math.floor(parseInt(rateLimit) / 12))} emails every 5 minutes
                                </p>
                            )}
                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="outline" onClick={() => { setCreateOpen(false); resetForm(); }}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreate} disabled={creating}>
                                    {creating ? "Creating..." : "Create Campaign"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Templates required notice */}
            {templates.length === 0 && (
                <div className="rounded-md border border-dashed p-4 mb-6 flex items-center gap-3 bg-muted/20">
                    <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                    <p className="text-sm text-muted-foreground">
                        Create an email template before starting a campaign.
                    </p>
                </div>
            )}

            {/* Campaign Cards */}
            {campaigns.length === 0 ? (
                <EmptyState
                    title="No campaigns yet"
                    description="Create a campaign to start sending outreach emails to your leads."
                    icon={Megaphone}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {campaigns.map((c) => {
                        const config = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.draft;
                        const StatusIcon = config.icon;
                        const progressPct = c.totalLeads > 0
                            ? Math.round((c.sentCount / c.totalLeads) * 100)
                            : 0;

                        return (
                            <div key={c._id} className="group rounded-lg border border-border/60 bg-card p-6 transition-colors duration-300 hover:border-primary/40 hover:bg-muted/10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-serif text-xl font-medium tracking-tight text-foreground truncate">
                                            {c.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">
                                            Template: {c.templateName}
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className={config.color}>
                                        <StatusIcon className="h-3 w-3 mr-1" />
                                        <span className="uppercase tracking-widest text-[10px] font-bold">{c.status}</span>
                                    </Badge>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {/* Progress */}
                                    <div className="flex items-center gap-3">
                                        <Progress value={progressPct} className="flex-1 h-2" />
                                        <span className="text-xs font-medium tabular-nums shrink-0 text-foreground">
                                            {c.sentCount}/{c.totalLeads}
                                        </span>
                                    </div>

                                    {/* Meta */}
                                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                                        <span>{c.rateLimitPerHour} emails/hr</span>
                                        <span>Created {format(new Date(c._creationTime), "MMM d")}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2 border-t border-border/40 mt-1">
                                        {(c.status === "draft" || c.status === "paused") && (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="gap-1.5"
                                                onClick={() => handleStart(c._id)}
                                            >
                                                <Play className="h-3.5 w-3.5" />
                                                {c.status === "paused" ? "Resume" : "Start"}
                                            </Button>
                                        )}
                                        {c.status === "running" && (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="gap-1.5"
                                                onClick={() => handlePause(c._id)}
                                            >
                                                <Pause className="h-3.5 w-3.5" />
                                                Pause
                                            </Button>
                                        )}
                                        {c.status !== "running" && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(c._id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
