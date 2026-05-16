"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Megaphone, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { CampaignCreateDialog } from "./(components)/CampaignCreateDialog";
import { CampaignCard } from "./(components)/CampaignCard";

export default function CampaignsPage() {
    const campaigns = useQuery(api.campaigns.getCampaignsByUser);
    const templates = useQuery(api.emailTemplates.getTemplatesByUser);

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

                <CampaignCreateDialog
                    disabled={templates.length === 0}
                />
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
                    {campaigns.map((c) => (
                        <CampaignCard key={c._id} campaign={c} />
                    ))}
                </div>
            )}
        </main>
    );
}
