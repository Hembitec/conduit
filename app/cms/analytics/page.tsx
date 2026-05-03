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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-8 w-20 mb-1" />
            <Skeleton className="h-3 w-28" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </>
        )}
      </CardContent>
    </Card>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          Top Articles
        </CardTitle>
        <CardDescription>Your most viewed published articles</CardDescription>
      </CardHeader>
      <CardContent>
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
              <div key={article.slug}>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-medium truncate">
                      {article.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-4">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-semibold tabular-nums">
                      {article.viewCount.toLocaleString()}
                    </span>
                  </div>
                </div>
                {idx < top5.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
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
    <main className="flex flex-col gap-6 p-4">
      {/* Header with date filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
              Analytics
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Track your blog performance and audience engagement.
          </p>
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
      <Card>
        <CardHeader>
          <CardTitle>Views Over Time</CardTitle>
          <CardDescription>
            Daily page views — {rangeLabel.toLowerCase()} ({rangeViewCount.toLocaleString()} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-end gap-1 h-[200px]">
              {Array.from({ length: chartDays }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                />
              ))}
            </div>
          ) : rangeViewCount === 0 ? (
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
            <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
              <span>{dayBuckets[0]?.[0]}</span>
              <span>{dayBuckets[dayBuckets.length - 1]?.[0]}</span>
            </div>
          )}
        </CardContent>
      </Card>

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
