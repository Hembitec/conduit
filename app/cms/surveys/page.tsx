"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { motion, AnimatePresence } from "framer-motion"
import {
  ClipboardList,
  Plus,
  MoreVertical,
  Play,
  Pause,
  Trash2,
  BarChart3,
  Settings2,
  Loader2,
  Copy,
  Check,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EmptyState } from "@/components/EmptyState"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import type { Id } from "@/convex/_generated/dataModel"
import type { Survey, SurveyStatus } from "@/types"

// ─── Constants ────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  SurveyStatus,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  draft: { label: "Draft", variant: "outline" },
  active: { label: "Active", variant: "default" },
  closed: { label: "Closed", variant: "secondary" },
}

// ─── Create Survey Dialog ─────────────────────────────────────────

function CreateSurveyDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [allowAnonymous, setAllowAnonymous] = useState(true)
  const [requireEmail, setRequireEmail] = useState(false)
  const [showProgress, setShowProgress] = useState(true)
  const [loading, setLoading] = useState(false)

  const createSurvey = useMutation(api.surveys.createSurvey)
  const router = useRouter()

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (val: string) => {
    setTitle(val)
    setSlug(generateSlug(val))
  }

  const handleCreate = async () => {
    if (!title.trim() || !slug.trim()) {
      toast.error("Title and slug are required")
      return
    }
    setLoading(true)
    try {
      const id = await createSurvey({
        title: title.trim(),
        description: description.trim() || undefined,
        slug: slug.trim(),
        questions: [],
        settings: { allowAnonymous, requireEmail, showProgress },
      })
      toast.success("Survey created")
      onClose()
      setTitle("")
      setSlug("")
      setDescription("")
      router.push(`/cms/surveys/${id}`)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create survey"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Survey</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="survey-title">Title</Label>
            <Input
              id="survey-title"
              placeholder="e.g. Product NPS Q2 2026"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="survey-slug">Slug</Label>
            <Input
              id="survey-slug"
              placeholder="product-nps-q2"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Used in the API URL: /api/surveys/{slug || "..."}
            </p>
          </div>
          <div>
            <Label htmlFor="survey-desc">Description (optional)</Label>
            <Input
              id="survey-desc"
              placeholder="We value your feedback..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-anon" className="text-sm">
                Allow anonymous responses
              </Label>
              <Switch
                id="allow-anon"
                checked={allowAnonymous}
                onCheckedChange={setAllowAnonymous}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="require-email" className="text-sm">
                Require email
              </Label>
              <Switch
                id="require-email"
                checked={requireEmail}
                onCheckedChange={setRequireEmail}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-progress" className="text-sm">
                Show progress bar
              </Label>
              <Switch
                id="show-progress"
                checked={showProgress}
                onCheckedChange={setShowProgress}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Create Survey
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Survey Card ──────────────────────────────────────────────────

function SurveyCard({ survey }: { survey: Survey }) {
  const [copied, setCopied] = useState(false)
  const updateStatus = useMutation(api.surveys.updateSurveyStatus)
  const deleteSurvey = useMutation(api.surveys.deleteSurvey)
  const router = useRouter()

  const statusConf = STATUS_CONFIG[survey.status]

  const handleStatusToggle = async () => {
    const next: SurveyStatus =
      survey.status === "active" ? "closed" : "active"
    try {
      await updateStatus({ id: survey._id, status: next })
      toast.success(`Survey ${next === "active" ? "activated" : "closed"}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update")
    }
  }

  const handleDelete = async () => {
    try {
      await deleteSurvey({ id: survey._id })
      toast.success("Survey deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  const copySlug = async () => {
    await navigator.clipboard.writeText(
      `/api/surveys/${survey.slug}`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("API path copied")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm truncate">
                  {survey.title}
                </h3>
                <Badge variant={statusConf.variant} className="text-xs shrink-0">
                  {statusConf.label}
                </Badge>
              </div>
              {survey.description && (
                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                  {survey.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{survey.questions.length} questions</span>
                <span>{survey.responseCount} responses</span>
                <button
                  onClick={copySlug}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  /api/surveys/{survey.slug}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="gap-1 text-xs"
                onClick={() =>
                  router.push(`/cms/surveys/${survey._id}/responses`)
                }
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Results
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1 text-xs"
                onClick={() => router.push(`/cms/surveys/${survey._id}`)}
              >
                <Settings2 className="h-3.5 w-3.5" />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleStatusToggle}>
                    {survey.status === "active" ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" /> Close Survey
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" /> Activate Survey
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export default function SurveysPage() {
  const [showCreate, setShowCreate] = useState(false)
  const rawSurveys = useQuery(api.surveys.getAllSurveys) as
    | Survey[]
    | undefined

  const surveys = rawSurveys ?? []

  return (
    <main className="flex flex-col gap-6 p-4 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <ClipboardList className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Surveys</h1>
            <p className="text-muted-foreground text-sm">
              NPS, ratings, multiple choice & open-ended surveys
            </p>
          </div>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Survey
        </Button>
      </motion.div>

      {/* Stats */}
      {rawSurveys !== undefined && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: surveys.length },
            {
              label: "Active",
              value: surveys.filter((s) => s.status === "active").length,
            },
            {
              label: "Responses",
              value: surveys.reduce((sum, s) => sum + s.responseCount, 0),
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {rawSurveys === undefined ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border bg-card p-5 animate-pulse"
            >
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : surveys.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No surveys yet"
            description="Create your first survey to start collecting NPS scores, ratings, and feedback from your users."
            action={{
              label: "Create Survey",
              onClick: () => setShowCreate(true),
            }}
          />
        ) : (
          <AnimatePresence>
            {surveys.map((survey) => (
              <SurveyCard key={survey._id} survey={survey} />
            ))}
          </AnimatePresence>
        )}
      </motion.div>

      <CreateSurveyDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </main>
  )
}
