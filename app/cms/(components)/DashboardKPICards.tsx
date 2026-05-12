"use client";

import Link from "next/link";
import { BookOpen, FileText, Eye, Users, UserCheck, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  href: string;
  sublabel?: string;
  highlight?: boolean;
}

function KPICard({ label, value, icon, href, sublabel, highlight }: KPICardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-4 rounded-lg border border-border/60 bg-card p-6 transition-colors duration-300",
        "hover:border-primary/40 hover:bg-muted/10",
        highlight && "border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/50"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <span className="text-muted-foreground/60 group-hover:text-primary transition-colors">
          {icon}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-serif text-4xl font-semibold tracking-tight tabular-nums text-foreground">
          {value}
        </p>
        {sublabel && (
          <p className="text-xs text-muted-foreground font-medium">{sublabel}</p>
        )}
      </div>
    </Link>
  );
}

interface DashboardKPICardsProps {
  publishedCount: number;
  draftCount: number;
  totalViews: number;
  subscribers: number;
  totalLeads: number;
  emailsSent: number;
}

export function DashboardKPICards({
  publishedCount,
  draftCount,
  totalViews,
  subscribers,
  totalLeads,
  emailsSent,
}: DashboardKPICardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <KPICard
        label="Published"
        value={publishedCount}
        icon={<BookOpen className="h-4 w-4" />}
        href="/cms/articles"
        sublabel="live articles"
        highlight={publishedCount > 0}
      />
      <KPICard
        label="Drafts"
        value={draftCount}
        icon={<FileText className="h-4 w-4" />}
        href="/cms/articles"
        sublabel="unpublished"
      />
      <KPICard
        label="Total Views"
        value={totalViews.toLocaleString()}
        icon={<Eye className="h-4 w-4" />}
        href="/cms/analytics"
        sublabel="all-time"
      />
      <KPICard
        label="Subscribers"
        value={subscribers}
        icon={<Users className="h-4 w-4" />}
        href="/cms/subscribers"
        sublabel="newsletter"
      />
      <KPICard
        label="Leads"
        value={totalLeads}
        icon={<UserCheck className="h-4 w-4" />}
        href="/cms/outreach/leads"
        sublabel="in database"
      />
      <KPICard
        label="Emails Sent"
        value={emailsSent.toLocaleString()}
        icon={<Mail className="h-4 w-4" />}
        href="/cms/outreach/analytics"
        sublabel="all campaigns"
      />
    </div>
  );
}
