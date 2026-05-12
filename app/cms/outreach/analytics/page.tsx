"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    PieChart,
    Send,
    Eye,
    MousePointerClick,
    AlertTriangle,
    TrendingUp,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// ─── Stat Card ───────────────────────────────────────────────────

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
    loading: boolean;
}

function StatCard({ title, value, subtitle, icon: Icon, loading }: StatCardProps) {
    return (
        <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-card p-6 transition-colors duration-300 hover:border-primary/40 hover:bg-muted/10">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {title}
                </span>
                <span className="text-muted-foreground/60">
                    <Icon className="h-4 w-4" />
                </span>
            </div>
            <div className="flex flex-col gap-1">
                {loading ? (
                    <>
                        <Skeleton className="h-9 w-20 mb-1" />
                        <Skeleton className="h-3 w-28" />
                    </>
                ) : (
                    <>
                        <p className="font-serif text-4xl font-semibold tracking-tight tabular-nums text-foreground">
                            {value}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">{subtitle}</p>
                    </>
                )}
            </div>
        </div>
    );
}

// ─── Bar Chart ───────────────────────────────────────────────────

function DailyChart({
    data,
    loading,
}: {
    data: { date: string; count: number }[];
    loading: boolean;
}) {
    const maxCount = useMemo(
        () => Math.max(...data.map((d) => d.count), 1),
        [data]
    );
    const total = useMemo(
        () => data.reduce((sum, d) => sum + d.count, 0),
        [data]
    );

    return (
        <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-card p-6">
            <div className="flex items-center justify-between mb-2 pb-4 border-b border-border/40">
                <div className="flex flex-col gap-1">
                    <h2 className="font-serif text-xl font-medium tracking-tight text-foreground">
                        Emails Sent Per Day
                    </h2>
                    <p className="text-xs text-muted-foreground font-medium">
                        Last 30 days — {total.toLocaleString()} total
                    </p>
                </div>
            </div>
            <div className="pt-2">
                {loading ? (() => {
                    // Fixed heights — deterministic on server AND client (no Math.random)
                    const SKELETON_HEIGHTS = [
                        45, 70, 30, 80, 55, 65, 40, 75, 50, 35,
                        60, 80, 25, 70, 55, 45, 65, 75, 35, 50,
                        70, 40, 80, 60, 30, 75, 55, 65, 45, 70,
                    ];
                    return (
                        <div className="flex items-end gap-1 h-[200px]">
                            {SKELETON_HEIGHTS.map((h, i) => (
                                <Skeleton
                                    key={i}
                                    className="flex-1 rounded-sm"
                                    style={{ height: `${h}%` }}
                                />
                            ))}
                        </div>
                    );
                })() : total === 0 ? (
                    <div className="h-[200px] flex flex-col items-center justify-center gap-2 text-center">
                        <Send className="h-16 w-16 text-muted-foreground/40" />
                        <p className="text-lg font-medium text-muted-foreground">
                            No emails sent yet
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Start a campaign to see analytics here
                        </p>
                    </div>
                ) : (
                    <>
                        <div
                            className="flex items-end gap-0.5 h-[200px]"
                            aria-label="Daily emails bar chart"
                        >
                            {data.map(({ date, count }) => {
                                const heightPct =
                                    maxCount > 0 ? (count / maxCount) * 100 : 0;
                                return (
                                    <div
                                        key={date}
                                        className="group relative flex-1 flex flex-col items-center justify-end"
                                        title={`${date}: ${count} email${count !== 1 ? "s" : ""}`}
                                    >
                                        <div
                                            className="w-full rounded-t-sm bg-primary/70 group-hover:bg-primary transition-colors"
                                            style={{
                                                height: `${Math.max(heightPct, count > 0 ? 4 : 0)}%`,
                                            }}
                                        />
                                        <span className="absolute bottom-full mb-1 hidden group-hover:flex whitespace-nowrap rounded bg-foreground px-1.5 py-0.5 text-[10px] text-background shadow z-10">
                                            {date}: {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between mt-1 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                            <span>{data[0]?.date}</span>
                            <span>{data[data.length - 1]?.date}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────

export default function OutreachAnalyticsPage() {
    const stats = useQuery(api.outreachAnalytics.getOutreachAnalytics);
    const dailyData = useQuery(api.outreachAnalytics.getEmailLogsByDay, { days: 30 });
    const breakdown = useQuery(api.outreachAnalytics.getCampaignBreakdown);

    const loading =
        stats === undefined || dailyData === undefined || breakdown === undefined;

    return (
        <main className="flex flex-col gap-8 p-4 sm:p-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border/50 pb-6">
                <div className="flex flex-col gap-1.5">
                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium flex items-center gap-2">
                        <PieChart className="h-4 w-4" />
                        Outreach Analytics
                    </p>
                    <h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground">
                        Performance
                    </h1>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Sent"
                    value={stats?.sent.toLocaleString() ?? "—"}
                    subtitle="Emails dispatched"
                    icon={Send}
                    loading={loading}
                />
                <StatCard
                    title="Open Rate"
                    value={stats ? `${stats.openRate}%` : "—"}
                    subtitle={`${stats?.opened ?? 0} opened`}
                    icon={Eye}
                    loading={loading}
                />
                <StatCard
                    title="Click Rate"
                    value={stats ? `${stats.clickRate}%` : "—"}
                    subtitle={`${stats?.clicked ?? 0} clicked`}
                    icon={MousePointerClick}
                    loading={loading}
                />
                <StatCard
                    title="Bounce Rate"
                    value={stats ? `${stats.bounceRate}%` : "—"}
                    subtitle={`${stats?.bounced ?? 0} bounced`}
                    icon={AlertTriangle}
                    loading={loading}
                />
            </div>

            {/* Daily Chart */}
            <DailyChart data={dailyData ?? []} loading={loading} />

            {/* Campaign Breakdown */}
            <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-card p-6 h-full">
                <div className="flex items-center justify-between mb-2 pb-4 border-b border-border/40">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <h2 className="font-serif text-xl font-medium tracking-tight text-foreground">
                            Campaign Breakdown
                        </h2>
                    </div>
                </div>
                <div className="flex flex-col gap-5 pt-2">
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            ))}
                        </div>
                    ) : (breakdown?.length ?? 0) === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">
                            No campaign data yet
                        </p>
                    ) : (
                        <div className="space-y-1">
                            {breakdown?.map((c, idx) => (
                                <div
                                    key={c._id}
                                    className="group flex items-center justify-between gap-4 hover:bg-muted/10 p-2 -mx-2 rounded-md transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="font-serif text-lg tracking-tight truncate group-hover:text-primary transition-colors text-foreground font-medium">
                                            {c.name}
                                        </span>
                                        <Badge variant="secondary" className="text-[9px] uppercase tracking-widest font-bold">
                                            {c.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-6 shrink-0 ml-4 text-[10px] uppercase tracking-widest text-muted-foreground">
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="font-serif text-base tabular-nums text-foreground leading-none">{c.sent}</span>
                                            <span>Sent</span>
                                        </div>
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="font-serif text-base tabular-nums text-foreground leading-none">{c.openRate}%</span>
                                            <span>Open</span>
                                        </div>
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="font-serif text-base tabular-nums text-foreground leading-none">{c.clicked}</span>
                                            <span>Clicks</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
