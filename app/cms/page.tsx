"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardKPICards } from "./(components)/DashboardKPICards";
import { DashboardTopArticles } from "./(components)/DashboardTopArticles";
import { DashboardOutreachPulse } from "./(components)/DashboardOutreachPulse";
import { DashboardAttentionItems } from "./(components)/DashboardAttentionItems";
import { DashboardQuickActions } from "./(components)/DashboardQuickActions";
import { LayoutDashboard } from "lucide-react";

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px] rounded-xl" />
        ))}
      </div>
      {/* Split row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Skeleton className="h-[280px] rounded-xl lg:col-span-3" />
        <Skeleton className="h-[280px] rounded-xl lg:col-span-2" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const data = useQuery(api.dashboard.getDashboardSummary);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <main className="flex w-full flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border/50 pb-6">
        <div className="flex flex-col gap-1.5">
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
            Command Center
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground">
            {greeting()}
          </h1>
        </div>
        <DashboardQuickActions />
      </div>

      {data === undefined ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Row 1 — KPI Cards */}
          <DashboardKPICards
            publishedCount={data.blog.publishedCount}
            draftCount={data.blog.draftCount}
            totalViews={data.blog.totalViews}
            subscribers={data.subscribers}
            totalLeads={data.outreach.totalLeads}
            emailsSent={data.outreach.emailStats.sent}
          />

          {/* Row 2 — Blog Performance + Outreach Pulse */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <DashboardTopArticles articles={data.blog.topArticles} />
            </div>
            <div className="lg:col-span-2">
              <DashboardOutreachPulse
                emailStats={data.outreach.emailStats}
                activeCampaign={data.outreach.activeCampaign}
                totalLeads={data.outreach.totalLeads}
                newLeads={data.outreach.newLeads}
              />
            </div>
          </div>

          {/* Row 3 — Attention Required (hidden when nothing to do) */}
          <DashboardAttentionItems
            pendingComments={data.attention.pendingComments}
            pausedCampaigns={data.attention.pausedCampaigns}
            draftDocuments={data.attention.draftDocuments}
            newLeads={data.outreach.newLeads}
          />
        </>
      )}
    </main>
  );
}
