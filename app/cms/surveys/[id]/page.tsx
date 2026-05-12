"use client"

import { useState, use } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Plus,
  GripVertical,
  Trash2,
  Loader2,
  Save,
  Hash,
  MessageSquare,
  List,
  Star,
  FileText,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import type { Id } from "@/convex/_generated/dataModel"
import type { SurveyQuestion, QuestionType } from "@/types"

// ─── Question Type Config ─────────────────────────────────────────

const QUESTION_TYPES: {
  value: QuestionType
  label: string
  icon: React.ElementType
  description: string
}[] = [
  {
    value: "nps",
    label: "NPS",
    icon: Hash,
    description: "Net Promoter Score (0-10)",
  },
  {
    value: "open_ended",
    label: "Open-Ended",
    icon: MessageSquare,
    description: "Free text response",
  },
  {
    value: "multiple_choice",
    label: "Multiple Choice",
    icon: List,
    description: "Pick from predefined options",
  },
  {
    value: "rating",
    label: "Rating Scale",
    icon: Star,
    description: "Numeric satisfaction score",
  },
  {
    value: "text_feedback",
    label: "Text Feedback",
    icon: FileText,
    description: "Categorized feedback (bug/feature/general)",
  },
]

const TYPE_ICON_MAP: Record<QuestionType, React.ElementType> = {
  nps: Hash,
  open_ended: MessageSquare,
  multiple_choice: List,
  rating: Star,
  text_feedback: FileText,
}

function generateId(): string {
  return crypto.randomUUID().slice(0, 8)
}

// ─── Question Editor ──────────────────────────────────────────────

function QuestionEditor({
  question,
  index,
  onChange,
  onDelete,
}: {
  question: SurveyQuestion
  index: number
  onChange: (q: SurveyQuestion) => void
  onDelete: () => void
}) {
  const Icon = TYPE_ICON_MAP[question.type]
  const typeConf = QUESTION_TYPES.find((t) => t.value === question.type)

  const updateField = <K extends keyof SurveyQuestion>(
    key: K,
    value: SurveyQuestion[K]
  ) => {
    onChange({ ...question, [key]: value })
  }

  const updateOption = (idx: number, val: string) => {
    const opts = [...(question.options ?? [])]
    opts[idx] = val
    updateField("options", opts)
  }

  const addOption = () => {
    updateField("options", [
      ...(question.options ?? []),
      `Option ${(question.options?.length ?? 0) + 1}`,
    ])
  }

  const removeOption = (idx: number) => {
    const opts = [...(question.options ?? [])]
    opts.splice(idx, 1)
    updateField("options", opts)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
    >
      <Card className="border-l-4 border-l-primary/30">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-1 pt-1 text-muted-foreground shrink-0">
              <GripVertical className="h-4 w-4" />
              <span className="text-xs font-mono w-5 text-center">
                {index + 1}
              </span>
            </div>

            <div className="flex-1 space-y-4">
              {/* Type + Title row */}
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={question.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder="Enter your question..."
                      className="font-medium"
                    />
                    <Select
                      value={question.type}
                      onValueChange={(v) =>
                        updateField("type", v as QuestionType)
                      }
                    >
                      <SelectTrigger className="w-[160px] shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QUESTION_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    value={question.description ?? ""}
                    onChange={(e) =>
                      updateField("description", e.target.value || undefined)
                    }
                    placeholder="Helper text (optional)"
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Type-specific config */}
              {question.type === "multiple_choice" && (
                <div className="pl-12 space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Options
                  </Label>
                  {(question.options ?? []).map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={opt}
                        onChange={(e) => updateOption(i, e.target.value)}
                        placeholder={`Option ${i + 1}`}
                        className="text-sm"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeOption(i)}
                        className="shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addOption}
                    className="text-xs gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add Option
                  </Button>
                </div>
              )}

              {question.type === "rating" && (
                <div className="pl-12 space-y-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <Label className="text-xs">Scale (max)</Label>
                      <Select
                        value={String(question.ratingScale ?? 5)}
                        onValueChange={(v) =>
                          updateField("ratingScale", Number(v))
                        }
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[3, 4, 5, 7, 10].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              1-{n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs">Low label</Label>
                      <Input
                        value={question.ratingLabels?.low ?? ""}
                        onChange={(e) =>
                          updateField("ratingLabels", {
                            low: e.target.value,
                            high: question.ratingLabels?.high ?? "Excellent",
                          })
                        }
                        placeholder="e.g. Very Bad"
                        className="text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs">High label</Label>
                      <Input
                        value={question.ratingLabels?.high ?? ""}
                        onChange={(e) =>
                          updateField("ratingLabels", {
                            low: question.ratingLabels?.low ?? "Poor",
                            high: e.target.value,
                          })
                        }
                        placeholder="e.g. Excellent"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-1">
                <Badge variant="outline" className="text-xs">
                  {typeConf?.description}
                </Badge>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`req-${question.id}`} className="text-xs">
                      Required
                    </Label>
                    <Switch
                      id={`req-${question.id}`}
                      checked={question.required}
                      onCheckedChange={(v: boolean) => updateField("required", v)}
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onDelete}
                    className="text-destructive hover:text-destructive text-xs gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Add Question Panel ───────────────────────────────────────────

function AddQuestionPanel({ onAdd }: { onAdd: (type: QuestionType) => void }) {
  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <p className="text-sm font-medium text-muted-foreground mb-3">
          Add a question
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {QUESTION_TYPES.map((t) => (
            <Button
              key={t.value}
              variant="outline"
              className="h-auto py-3 flex flex-col gap-1.5 text-xs"
              onClick={() => onAdd(t.value)}
            >
              <t.icon className="h-4 w-4 text-primary" />
              {t.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export default function SurveyBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const surveyId = id as Id<"surveys">
  const survey = useQuery(api.surveys.getSurvey, { id: surveyId })
  const updateSurvey = useMutation(api.surveys.updateSurvey)
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [questions, setQuestions] = useState<SurveyQuestion[] | null>(null)

  // Sync questions from server on first load
  const activeQuestions = questions ?? (survey?.questions as SurveyQuestion[] | undefined) ?? []

  const handleQuestionChange = (idx: number, q: SurveyQuestion) => {
    const updated = [...activeQuestions]
    updated[idx] = q
    setQuestions(updated)
  }

  const handleDeleteQuestion = (idx: number) => {
    const updated = [...activeQuestions]
    updated.splice(idx, 1)
    setQuestions(updated)
  }

  const handleAddQuestion = (type: QuestionType) => {
    const newQ: SurveyQuestion = {
      id: generateId(),
      type,
      title: "",
      required: true,
      ...(type === "multiple_choice" && {
        options: ["Option 1", "Option 2"],
      }),
      ...(type === "rating" && {
        ratingScale: 5,
        ratingLabels: { low: "Poor", high: "Excellent" },
      }),
    }
    setQuestions([...activeQuestions, newQ])
  }

  const handleSave = async () => {
    if (!survey) return
    setSaving(true)
    try {
      await updateSurvey({
        id: surveyId,
        questions: activeQuestions,
      })
      toast.success("Questions saved")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  if (survey === undefined) {
    return (
      <main className="flex items-center justify-center p-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </main>
    )
  }

  if (survey === null) {
    return (
      <main className="flex flex-col items-center justify-center p-20 gap-4">
        <p className="text-muted-foreground">Survey not found</p>
        <Button variant="outline" onClick={() => router.push("/cms/surveys")}>
          Back to Surveys
        </Button>
      </main>
    )
  }

  return (
    <main className="flex flex-col gap-6 p-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/cms/surveys")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {survey.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {activeQuestions.length} question
              {activeQuestions.length !== 1 ? "s" : ""} · /api/surveys/
              {survey.slug}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save
        </Button>
      </div>

      <Separator />

      {/* Questions */}
      <div className="space-y-4">
        <AnimatePresence>
          {activeQuestions.map((q, i) => (
            <QuestionEditor
              key={q.id}
              question={q}
              index={i}
              onChange={(updated) => handleQuestionChange(i, updated)}
              onDelete={() => handleDeleteQuestion(i)}
            />
          ))}
        </AnimatePresence>

        <AddQuestionPanel onAdd={handleAddQuestion} />
      </div>
    </main>
  )
}
