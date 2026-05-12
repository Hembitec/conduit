"use client";

import Link from "next/link";
import { Send, ArrowRight, Zap, CheckCircle2, MousePointerClick, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmailStats {
  total: number;
  sent: number;
  opened: number;
  clicked: number;
  bounced: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
}

interface ActiveCampaign {
  id: string;
  name: string;
  sentCount: number;
  totalLeads: number;
  status: string;
}

interface DashboardOutreachPulseProps {
  emailStats: EmailStats;
  activeCampaign: ActiveCampaign | null;
  totalLeads: number;
  newLeads: number;
}

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}

function StatRow({ icon, label, value, color }: StatRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className={cn("h-4 w-4", color)}>{icon}</span>
        {label}
      </div>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
}

export function DashboardOutreachPulse({
  emailStats,
  activeCampaign,
  totalLeads,
  newLeads,
}: DashboardOutreachPulseProps) {
  const campaignProgress =
    activeCampaign && activeCampaign.totalLeads > 0
      ? Math.round((activeCampaign.sentCount / activeCampaign.totalLeads) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border/60 bg-card p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Send className="h-4 w-4 text-primary" />
          <h2 className="font-serif text-xl font-medium tracking-tight text-foreground">
            Outreach Pulse
          </h2>
        </div>
        <Link
          href="/cms/outreach/analytics"
          className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors uppercase tracking-wider"
        >
          Full report <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Active Campaign */}
      {activeCampaign ? (
        <div className="rounded-lg bg-muted/40 border p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-sm font-medium truncate">{activeCampaign.name}</span>
            </div>
            <Badge variant="default" className="text-[10px] shrink-0">
              Running
            </Badge>
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${campaignProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{activeCampaign.sentCount.toLocaleString()} sent</span>
              <span>{campaignProgress}% of {activeCampaign.totalLeads.toLocaleString()} leads</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-muted/20 border border-dashed p-3 flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">No active campaign</span>
          <Button variant="outline" size="sm" className="text-xs h-7" asChild>
            <Link href="/cms/outreach/compose">Start one</Link>
          </Button>
        </div>
      )}

      {/* Email Stat Rows */}
      <div className="flex flex-col gap-3">
        <StatRow
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Open rate"
          value={emailStats.sent > 0 ? `${emailStats.openRate}%` : "—"}
          color="text-emerald-500"
        />
        <StatRow
          icon={<MousePointerClick className="h-4 w-4" />}
          label="Click rate"
          value={emailStats.sent > 0 ? `${emailStats.clickRate}%` : "—"}
          color="text-blue-500"
        />
        <StatRow
          icon={<XCircle className="h-4 w-4" />}
          label="Bounce rate"
          value={emailStats.sent > 0 ? `${emailStats.bounceRate}%` : "—"}
          color="text-destructive"
        />
      </div>

      {/* Lead Breakdown */}
      <div className="flex items-center justify-between pt-4 border-t border-border/40">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-medium tabular-nums leading-none text-foreground">{totalLeads}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Total leads</span>
          </div>
          <div className="h-8 w-px bg-border/60" />
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-medium tabular-nums text-primary leading-none">{newLeads}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">New leads</span>
          </div>
        </div>
        <Link
          href="/cms/outreach/leads"
          className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors uppercase tracking-wider"
        >
          View leads <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
