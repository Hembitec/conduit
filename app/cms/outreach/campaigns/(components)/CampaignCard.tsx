"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import {
    Play,
    Pause,
    Trash2,
    CheckCircle2,
    Clock,
    Tag,
    FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

// ─── Status Styling ──────────────────────────────────────────────

const STATUS_CONFIG: Record<
    string,
    { color: string; icon: React.ElementType }
> = {
    draft: { color: "bg-muted text-muted-foreground", icon: Clock },
    running: { color: "bg-primary/10 text-primary", icon: Play },
    paused: { color: "bg-yellow-500/10 text-yellow-600", icon: Pause },
    completed: {
        color: "bg-emerald-500/10 text-emerald-600",
        icon: CheckCircle2,
    },
};

// ─── Types ───────────────────────────────────────────────────────

interface CampaignData {
    _id: Id<"campaigns">;
    _creationTime: number;
    name: string;
    templateName: string;
    status: string;
    targetLeadStatus: string;
    targetCategory?: string;
    targetFolderId?: Id<"leadFolders">;
    sentCount: number;
    totalLeads: number;
    rateLimitPerHour: number;
    senderEmail: string;
}

interface CampaignCardProps {
    campaign: CampaignData;
}

// ─── Component ───────────────────────────────────────────────────

export function CampaignCard({ campaign: c }: CampaignCardProps) {
    const startCampaign = useMutation(api.campaigns.startCampaign);
    const pauseCampaign = useMutation(api.campaigns.pauseCampaign);
    const deleteCampaign = useMutation(api.campaigns.deleteCampaign);

    const config = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.draft;
    const StatusIcon = config.icon;
    const progressPct =
        c.totalLeads > 0
            ? Math.round((c.sentCount / c.totalLeads) * 100)
            : 0;

    const handleStart = async () => {
        try {
            await startCampaign({ campaignId: c._id });
            toast.success("Campaign started");
        } catch (e) {
            toast.error(
                e instanceof Error ? e.message : "Failed to start campaign"
            );
        }
    };

    const handlePause = async () => {
        try {
            await pauseCampaign({ campaignId: c._id });
            toast.success("Campaign paused");
        } catch (e) {
            toast.error(
                e instanceof Error ? e.message : "Failed to pause campaign"
            );
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this campaign?")) return;
        try {
            await deleteCampaign({ campaignId: c._id });
            toast.success("Campaign deleted");
        } catch (e) {
            toast.error(
                e instanceof Error ? e.message : "Failed to delete campaign"
            );
        }
    };

    return (
        <div className="group rounded-lg border border-border/60 bg-card p-6 transition-colors duration-300 hover:border-primary/40 hover:bg-muted/10">
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
                    <span className="uppercase tracking-widest text-[10px] font-bold">
                        {c.status}
                    </span>
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

                {/* Meta — targeting info */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                    <span>{c.rateLimitPerHour} emails/hr</span>
                    <span className="text-border">·</span>
                    <span>Target: {c.targetLeadStatus}</span>
                    {c.targetCategory && (
                        <>
                            <span className="text-border">·</span>
                            <span className="flex items-center gap-0.5">
                                <Tag className="h-2.5 w-2.5" />
                                {c.targetCategory}
                            </span>
                        </>
                    )}
                    {c.targetFolderId && (
                        <>
                            <span className="text-border">·</span>
                            <span className="flex items-center gap-0.5">
                                <FolderOpen className="h-2.5 w-2.5" />
                                Folder
                            </span>
                        </>
                    )}
                </div>

                {/* Sender + date */}
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                    <span>From: {c.senderEmail}</span>
                    <span>
                        Created{" "}
                        {format(new Date(c._creationTime), "MMM d")}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-border/40 mt-1">
                    {(c.status === "draft" || c.status === "paused") && (
                        <Button
                            size="sm"
                            variant="secondary"
                            className="gap-1.5"
                            onClick={handleStart}
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
                            onClick={handlePause}
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
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
