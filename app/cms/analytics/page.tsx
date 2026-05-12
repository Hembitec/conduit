"use client"

import { useState, useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import {
  BarChart3,
  TrendingUp,
  FileText,
  Eye,
  Calendar,
  Trophy,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

// ─── Types ───────────────────────────────────────────────────────

type DateRange = "7d" | "30d" | "all"

const RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "all", label: "All time" },
]

function getRangeSince(range: DateRange): number | undefined {
  if (range === "7d") return Date.now() - 7 * 86_400_000
  if (range === "30d") return Date.now() - 30 * 86_400_000
  return undefined
}

function getRangeDays(range: DateRange): number {
  if (range === "7d") return 7
  if (range === "30d") return 30
  return 30 // chart always shows max 30 buckets even for "all"
}

// ─── Helpers ─────────────────────────────────────────────────────

function getDayLabel(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function buildDayBuckets(views: { timestamp: number }[], days: number) {
  const buckets: Record<string, number> = {}
  const now = Date.now()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * 86_400_000)
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    buckets[key] = 0
  }

  for (const v of views) {
    const key = getDayLabel(v.timestamp)
    if (key in buckets) buckets[key]++
  }

  return Object.entries(buckets)
}

// ─── Stat Card ───────────────────────────────────────────────────

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ElementType
  loading: boolean
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
  )
}

// ─── Top Articles Table ──────────────────────────────────────────

interface ArticleStat {
  title: string
  slug: string
  viewCount: number
  published: boolean
}

function TopArticlesTable({
  articles,
  loading,
}: {
  articles: ArticleStat[]
  loading: boolean
}) {
  const top5 = articles
    .filter((a) => a.published)
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-card p-6 h-full">
      <div className="flex items-center justify-between mb-2 pb-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          <h2 className="font-serif text-xl font-medium tracking-tight text-foreground">
            Top Articles
          </h2>
        </div>
      </div>
      <div className="flex flex-col gap-5 pt-2">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : top5.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No published articles yet
          </p>
        ) : (
          <div className="space-y-1">
            {top5.map((article, idx) => (
              <div
                key={article.slug}
                className="group flex items-center justify-between gap-4 hover:bg-muted/10 p-2 -mx-2 rounded-md transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="font-serif text-2xl text-muted-foreground/30 tabular-nums w-6 shrink-0 leading-none mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium truncate group-hover:text-primary transition-colors text-foreground">
                    {article.title}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
                  <span className="font-serif text-lg tabular-nums text-foreground leading-none">
                    {article.viewCount.toLocaleString()}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Views
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>("30d")
  
  // Memoize since to avoid infinite re-renders from Date.now() changing every render
  const since = useMemo(() => getRangeSince(range), [range])
  const chartDays = useMemo(() => getRangeDays(range), [range])

  const rangeViews = useQuery(
    api.analytics.getPageViews,
    since !== undefined ? { since } : {}
  )
  const articles = useQuery(api.blogs.getArticleStats)

  const loading = rangeViews === undefined || articles === undefined

  const totalViews = articles?.reduce((sum, a) => sum + (a.viewCount || 0), 0) ?? 0
  const rangeViewCount = rangeViews?.length ?? 0
  const publishedCount = articles?.filter((a) => a.published).length ?? 0
  const avgViews =
    publishedCount > 0 ? Math.round(totalViews / publishedCount) : 0

  const dayBuckets = useMemo(() => buildDayBuckets(rangeViews ?? [], chartDays), [rangeViews, chartDays])
  const maxCount = useMemo(() => Math.max(...dayBuckets.map(([, c]) => c), 1), [dayBuckets])

  const topEntry = useMemo(() => dayBuckets.reduce<[string, number]>(
    (best, curr) => (curr[1] > best[1] ? curr : best),
    ["—", 0]
  ), [dayBuckets])
  const topDay =
    topEntry[1] > 0 ? `${topEntry[0]} (${topEntry[1]})` : "—"

  const rangeLabel =
    RANGE_OPTIONS.find((o) => o.value === range)?.label ?? "Last 30 days"

  return (
    <main className="flex flex-col gap-8 p-4 sm:p-0">
      {/* Header with date filter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border/50 pb-6">
        <div className="flex flex-col gap-1.5">
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Blog Analytics
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground">
            Performance
          </h1>
        </div>
        <Select
          value={range}
          onValueChange={(v) => setRange(v as DateRange)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {RANGE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Views"
          value={totalViews.toLocaleString()}
          subtitle="All time page views"
          icon={Eye}
          loading={loading}
        />
        <StatCard
          title="Articles Published"
          value={publishedCount}
          subtitle={`${(articles?.length ?? 0) - publishedCount} draft${(articles?.length ?? 0) - publishedCount !== 1 ? "s" : ""}`}
          icon={FileText}
          loading={loading}
        />
        <StatCard
          title="Avg. Views / Post"
          value={avgViews}
          subtitle="Across published articles"
          icon={TrendingUp}
          loading={loading}
        />
        <StatCard
          title="Top Day"
          value={topDay}
          subtitle={`Highest traffic day (${rangeLabel.toLowerCase()})`}
          icon={Calendar}
          loading={loading}
        />
      </div>

      {/* Bar Chart */}
      <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-card p-6">
        <div className="flex items-center justify-between mb-2 pb-4 border-b border-border/40">
          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-xl font-medium tracking-tight text-foreground">
              Views Over Time
            </h2>
            <p className="text-xs text-muted-foreground font-medium">
              Daily page views — {rangeLabel.toLowerCase()} ({rangeViewCount.toLocaleString()} total)
            </p>
          </div>
        </div>
        <div className="pt-2">
          {loading ? (() => {
            const SKELETON_HEIGHTS = [
              45, 70, 30, 80, 55, 65, 40, 75, 50, 35,
              60, 80, 25, 70, 55, 45, 65, 75, 35, 50,
              70, 40, 80, 60, 30, 75, 55, 65, 45, 70,
            ];
            const heights = SKELETON_HEIGHTS.slice(0, chartDays);
            return (
              <div className="flex items-end gap-1 h-[200px]">
                {heights.map((h, i) => (
                  <Skeleton
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            );
          })() : rangeViewCount === 0 ? (
            <div className="h-[200px] flex flex-col items-center justify-center gap-2 text-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground/40" />
              <p className="text-lg font-medium text-muted-foreground">
                No analytics data yet
              </p>
              <p className="text-sm text-muted-foreground">
                Publish your first article to start tracking views
              </p>
            </div>
          ) : (
            <div
              className="flex items-end gap-0.5 h-[200px]"
              aria-label="Daily views bar chart"
            >
              {dayBuckets.map(([label, count]) => {
                const heightPct =
                  maxCount > 0 ? (count / maxCount) * 100 : 0
                return (
                  <div
                    key={label}
                    className="group relative flex-1 flex flex-col items-center justify-end"
                    title={`${label}: ${count} view${count !== 1 ? "s" : ""}`}
                  >
                    <div
                      className="w-full rounded-t-sm bg-primary/70 group-hover:bg-primary transition-colors"
                      style={{
                        height: `${Math.max(heightPct, count > 0 ? 4 : 0)}%`,
                      }}
                    />
                    {/* Tooltip */}
                    <span className="absolute bottom-full mb-1 hidden group-hover:flex whitespace-nowrap rounded bg-foreground px-1.5 py-0.5 text-[10px] text-background shadow z-10">
                      {label}: {count}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
          {!loading && rangeViewCount > 0 && (
            <div className="flex justify-between mt-1 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
              <span>{dayBuckets[0]?.[0]}</span>
              <span>{dayBuckets[dayBuckets.length - 1]?.[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Top 5 Articles */}
      <TopArticlesTable
        articles={
          (articles ?? []).map((a) => ({
            title: a.title,
            slug: a.slug,
            viewCount: a.viewCount,
            published: a.published,
          }))
        }
        loading={loading}
      />
    </main>
  )
}
