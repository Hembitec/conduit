"use client";

import Link from "next/link";
import { MessageSquare, Pause, FileEdit, UserCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PausedCampaign {
  id: string;
  name: string;
}

interface DashboardAttentionItemsProps {
  pendingComments: number;
  pausedCampaigns: PausedCampaign[];
  draftDocuments: number;
  newLeads: number;
}

interface AttentionRowProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  href: string;
  cta: string;
  urgent?: boolean;
}

function AttentionRow({ icon, label, count, href, cta, urgent }: AttentionRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors",
        urgent ? "border-destructive/20 bg-destructive/5" : "hover:bg-muted/40"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className={cn("shrink-0", urgent ? "text-destructive" : "text-muted-foreground")}>
          {icon}
        </span>
        <span className="text-sm font-medium truncate">{label}</span>
        {count !== undefined && count > 0 && (
          <Badge
            variant={urgent ? "destructive" : "secondary"}
            className="text-[10px] tabular-nums shrink-0"
          >
            {count}
          </Badge>
        )}
      </div>
      <Button variant="ghost" size="sm" className="gap-1 text-xs shrink-0" asChild>
        <Link href={href}>
          {cta} <ChevronRight className="h-3 w-3" />
        </Link>
      </Button>
    </div>
  );
}

export function DashboardAttentionItems({
  pendingComments,
  pausedCampaigns,
  draftDocuments,
  newLeads,
}: DashboardAttentionItemsProps) {
  const hasItems =
    pendingComments > 0 ||
    pausedCampaigns.length > 0 ||
    draftDocuments > 0 ||
    newLeads > 0;

  if (!hasItems) return null;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-card p-6">
      <div className="flex items-center gap-2 mb-2 pb-4 border-b border-border/40">
        <h2 className="font-serif text-xl font-medium tracking-tight text-foreground">
          Needs Attention
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        {pendingComments > 0 && (
          <AttentionRow
            icon={<MessageSquare className="h-4 w-4" />}
            label="Comments awaiting approval"
            count={pendingComments}
            href="/cms/comments"
            cta="Review"
            urgent
          />
        )}

        {pausedCampaigns.map((c) => (
          <AttentionRow
            key={c.id}
            icon={<Pause className="h-4 w-4" />}
            label={`Campaign paused: ${c.name}`}
            href="/cms/outreach/campaigns"
            cta="Resume"
          />
        ))}

        {newLeads > 0 && (
          <AttentionRow
            icon={<UserCheck className="h-4 w-4" />}
            label="New uncontacted leads"
            count={newLeads}
            href="/cms/outreach/leads"
            cta="View leads"
          />
        )}

        {draftDocuments > 0 && (
          <AttentionRow
            icon={<FileEdit className="h-4 w-4" />}
            label="Documents in your editor"
            count={draftDocuments}
            href="/cms/documents"
            cta="Continue writing"
          />
        )}
      </div>
    </div>
  );
}
