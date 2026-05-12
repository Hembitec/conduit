"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { motion, AnimatePresence } from "framer-motion"
import {
  Inbox,
  Bug,
  Lightbulb,
  MessageCircle,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Clock,
  Loader2,
  Search,
  Image as ImageIcon,
  X,
  Globe,
  Mail,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EmptyState } from "@/components/EmptyState"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { Id } from "@/convex/_generated/dataModel"
import type { Feedback, FeedbackType, FeedbackStatus } from "@/types"

// ─── Constants ────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  FeedbackType,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  bug: {
    label: "Bug",
    icon: Bug,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  feature: {
    label: "Feature",
    icon: Lightbulb,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  general: {
    label: "General",
    icon: MessageCircle,
    color: "text-primary",
    bg: "bg-primary/10",
  },
}

const STATUS_CONFIG: Record<
  FeedbackStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  new: { label: "New", variant: "default" },
  in_progress: { label: "In Progress", variant: "secondary" },
  resolved: { label: "Resolved", variant: "outline" },
  dismissed: { label: "Dismissed", variant: "destructive" },
}

const STATUS_OPTIONS: FeedbackStatus[] = [
  "new",
  "in_progress",
  "resolved",
  "dismissed",
]

// ─── Stat Cards ───────────────────────────────────────────────────

function FeedbackStats({ items }: { items: Feedback[] }) {
  const stats = [
    {
      label: "Total",
      value: items.length,
      icon: Inbox,
      color: "text-primary",
    },
    {
      label: "New",
      value: items.filter((f) => f.status === "new").length,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      label: "Bugs",
      value: items.filter((f) => f.type === "bug").length,
      icon: Bug,
      color: "text-destructive",
    },
    {
      label: "Ideas",
      value: items.filter((f) => f.type === "feature").length,
      icon: Lightbulb,
      color: "text-yellow-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Screenshot Lightbox ──────────────────────────────────────────

function ScreenshotLightbox({
  urls,
  open,
  initial,
  onClose,
}: {
  urls: string[]
  open: boolean
  initial: number
  onClose: () => void
}) {
  const [idx, setIdx] = useState(initial)

  // Sync index when lightbox opens
  useEffect(() => {
    if (open) {
      setIdx(initial)
    }
  }, [open, initial])

  const nextImg = () => setIdx((i) => (i + 1) % urls.length)
  const prevImg = () => setIdx((i) => (i - 1 + urls.length) % urls.length)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/90 border-border/30">
        <DialogHeader className="sr-only">
          <DialogTitle>Screenshot preview</DialogTitle>
        </DialogHeader>
        <div className="relative w-full flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={urls[idx]}
            alt={`Screenshot ${idx + 1}`}
            className="w-full max-h-[80vh] object-contain"
          />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/80 transition-colors z-10"
          >
            <X className="h-4 w-4 text-white" />
          </button>

          {urls.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImg(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/80 transition-colors z-10"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); nextImg(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/80 transition-colors z-10"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>

              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
                {urls.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all",
                      i === idx ? "bg-white w-4" : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


// ─── Single Feedback Card ─────────────────────────────────────────

function FeedbackCard({
  item,
  onStatusChange,
  onDelete,
  isLoading,
}: {
  item: Feedback
  onStatusChange: (id: Id<"feedback">, status: FeedbackStatus) => void
  onDelete: (id: Id<"feedback">) => void
  isLoading: boolean
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)
  const typeConf = TYPE_CONFIG[item.type]
  const statusConf = STATUS_CONFIG[item.status]
  const TypeIcon = typeConf.icon

  const openScreenshot = (i: number) => {
    setLightboxIdx(i)
    setLightboxOpen(true)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "group rounded-xl border bg-card p-5 transition-all hover:shadow-md",
          item.status === "new" && "border-primary/20 bg-primary/[0.02]"
        )}
      >
        <div className="flex items-start gap-4">
          {/* Type icon */}
          <div
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
              typeConf.bg
            )}
          >
            <TypeIcon className={cn("h-5 w-5", typeConf.color)} />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm">{item.authorName}</span>
                <Badge variant="outline" className="text-xs font-normal">
                  {typeConf.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={statusConf.variant} className="text-xs">
                  {statusConf.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(item._creationTime).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Meta info row */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
              {item.authorEmail && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {item.authorEmail}
                </span>
              )}
              {item.pageUrl && (
                <a
                  href={item.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <Globe className="h-3 w-3" />
                  <span className="max-w-[200px] truncate">{item.pageUrl}</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </div>

            <Separator className="mb-3" />

            {/* Message */}
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {item.message}
            </p>

            {/* Screenshots */}
            {item.screenshots && item.screenshots.length > 0 && (
              <div className="mt-4 flex gap-2">
                {item.screenshots.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => openScreenshot(i)}
                    className="relative group/img w-20 h-14 rounded-lg overflow-hidden border bg-muted hover:ring-2 hover:ring-primary transition-all"
                    title="Click to view screenshot"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Screenshot ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-white" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-xs"
                    disabled={isLoading}
                  >
                    Status
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {STATUS_OPTIONS.map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => onStatusChange(item._id, s)}
                      className={cn(
                        item.status === s && "font-medium text-primary"
                      )}
                    >
                      {STATUS_CONFIG[s].label}
                      {item.status === s && (
                        <CheckCircle2 className="ml-auto h-3.5 w-3.5" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                size="sm"
                variant="ghost"
                className="gap-1 text-xs text-destructive hover:text-destructive"
                onClick={() => onDelete(item._id)}
                disabled={isLoading}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lightbox */}
      {item.screenshots && item.screenshots.length > 0 && (
        <ScreenshotLightbox
          urls={item.screenshots}
          open={lightboxOpen}
          initial={lightboxIdx}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

type TabFilter = "all" | FeedbackType | "new"

export default function FeedbackPage() {
  const [tab, setTab] = useState<TabFilter>("all")
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const rawFeedback = useQuery(api.feedback.getAllFeedback) as Feedback[] | undefined
  const updateStatus = useMutation(api.feedback.updateFeedbackStatus)
  const deleteFeedback = useMutation(api.feedback.deleteFeedback)

  const items = rawFeedback ?? []

  const filtered = items.filter((f) => {
    const matchesTab =
      tab === "all" ? true :
      tab === "new" ? f.status === "new" :
      f.type === tab
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      f.authorName.toLowerCase().includes(q) ||
      f.message.toLowerCase().includes(q) ||
      f.authorEmail?.toLowerCase().includes(q) ||
      f.pageUrl?.toLowerCase().includes(q)
    return matchesTab && matchesSearch
  })

  async function handleStatusChange(
    id: Id<"feedback">,
    status: FeedbackStatus
  ) {
    setIsLoading(true)
    try {
      await updateStatus({ id, status })
      toast.success(`Marked as ${STATUS_CONFIG[status].label}`)
    } catch {
      toast.error("Failed to update status")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: Id<"feedback">) {
    setIsLoading(true)
    try {
      await deleteFeedback({ id })
      toast.success("Feedback deleted")
    } catch {
      toast.error("Failed to delete feedback")
    } finally {
      setIsLoading(false)
    }
  }

  const newCount = items.filter((f) => f.status === "new").length

  return (
    <main className="flex flex-col gap-6 p-4 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <Inbox className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
          <p className="text-muted-foreground text-sm">
            Bug reports, feature requests, and messages from your users
          </p>
        </div>
        {newCount > 0 && (
          <Badge className="ml-auto">{newCount} new</Badge>
        )}
      </motion.div>

      {/* Stats */}
      {rawFeedback !== undefined && <FeedbackStats items={items} />}

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
      >
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as TabFilter)}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="new">
              New
              {newCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                  {newCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="bug">Bugs</TabsTrigger>
            <TabsTrigger value="feature">Ideas</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full sm:w-[250px]"
          />
        </div>
      </motion.div>

      {/* List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="space-y-3"
      >
        {rawFeedback === undefined ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border bg-card p-5 animate-pulse"
            >
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-muted shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={search ? "No feedback found" : "No feedback yet"}
            description={
              search
                ? "Try adjusting your search or filters"
                : "Once you integrate the Feedback API, submissions will appear here"
            }
            action={
              search || tab !== "all"
                ? {
                    label: "Clear filters",
                    onClick: () => { setSearch(""); setTab("all") },
                  }
                : undefined
            }
          />
        ) : (
          <AnimatePresence>
            {filtered.map((item) => (
              <FeedbackCard
                key={item._id}
                item={item}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                isLoading={isLoading}
              />
            ))}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Global loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/30 backdrop-blur-sm pointer-events-none">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
    </main>
  )
}
