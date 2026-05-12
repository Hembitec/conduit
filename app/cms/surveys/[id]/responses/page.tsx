"use client"

import { use } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  BarChart3,
  Users,
  TrendingUp,
  Loader2,
  Mail,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { EmptyState } from "@/components/EmptyState"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import type { Id } from "@/convex/_generated/dataModel"
import type {
  Survey,
  SurveyResponse,
  SurveyQuestion,
  SurveyAnswer,
} from "@/types"

// ─── NPS Calculator ───────────────────────────────────────────────

function NpsBreakdown({
  question,
  answers,
}: {
  question: SurveyQuestion
  answers: SurveyAnswer[]
}) {
  const scores = answers
    .filter((a) => a.questionId === question.id)
    .map((a) => Number(a.value))
  if (scores.length === 0) return <p className="text-sm text-muted-foreground">No responses yet</p>

  const detractors = scores.filter((s) => s <= 6).length
  const passives = scores.filter((s) => s === 7 || s === 8).length
  const promoters = scores.filter((s) => s >= 9).length
  const nps = Math.round(
    ((promoters - detractors) / scores.length) * 100
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "text-4xl font-bold",
            nps >= 50
              ? "text-green-500"
              : nps >= 0
                ? "text-yellow-500"
                : "text-destructive"
          )}
        >
          {nps}
        </div>
        <div className="text-sm text-muted-foreground">
          NPS Score ({scores.length} responses)
        </div>
      </div>
      <div className="flex gap-1 h-6 rounded-full overflow-hidden">
        {detractors > 0 && (
          <div
            className="bg-destructive/70 flex items-center justify-center text-[10px] text-white font-medium"
            style={{ width: `${(detractors / scores.length) * 100}%` }}
          >
            {Math.round((detractors / scores.length) * 100)}%
          </div>
        )}
        {passives > 0 && (
          <div
            className="bg-yellow-400/70 flex items-center justify-center text-[10px] font-medium"
            style={{ width: `${(passives / scores.length) * 100}%` }}
          >
            {Math.round((passives / scores.length) * 100)}%
          </div>
        )}
        {promoters > 0 && (
          <div
            className="bg-green-500/70 flex items-center justify-center text-[10px] text-white font-medium"
            style={{ width: `${(promoters / scores.length) * 100}%` }}
          >
            {Math.round((promoters / scores.length) * 100)}%
          </div>
        )}
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-destructive/70" />
          Detractors ({detractors})
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
          Passives ({passives})
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500/70" />
          Promoters ({promoters})
        </span>
      </div>
    </div>
  )
}

// ─── Rating Breakdown ─────────────────────────────────────────────

function RatingBreakdown({
  question,
  answers,
}: {
  question: SurveyQuestion
  answers: SurveyAnswer[]
}) {
  const values = answers
    .filter((a) => a.questionId === question.id)
    .map((a) => Number(a.value))
  if (values.length === 0) return <p className="text-sm text-muted-foreground">No responses yet</p>

  const scale = question.ratingScale ?? 5
  const avg = values.reduce((s, v) => s + v, 0) / values.length
  const distribution: Record<number, number> = {}
  for (let i = 1; i <= scale; i++) distribution[i] = 0
  for (const v of values) distribution[v] = (distribution[v] ?? 0) + 1

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="text-4xl font-bold text-primary">
          {avg.toFixed(1)}
        </div>
        <div className="text-sm text-muted-foreground">
          Average rating ({values.length} responses)
          <br />
          {question.ratingLabels?.low} → {question.ratingLabels?.high}
        </div>
      </div>
      <div className="space-y-1.5">
        {Array.from({ length: scale }, (_, i) => scale - i).map((n) => {
          const count = distribution[n] ?? 0
          const pct = values.length > 0 ? (count / values.length) * 100 : 0
          return (
            <div key={n} className="flex items-center gap-2 text-xs">
              <span className="w-4 text-right font-mono text-muted-foreground">
                {n}
              </span>
              <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary/60 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 text-muted-foreground">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Multiple Choice Breakdown ────────────────────────────────────

function ChoiceBreakdown({
  question,
  answers,
}: {
  question: SurveyQuestion
  answers: SurveyAnswer[]
}) {
  const choices = answers
    .filter((a) => a.questionId === question.id)
    .map((a) => String(a.value))
  if (choices.length === 0) return <p className="text-sm text-muted-foreground">No responses yet</p>

  const counts: Record<string, number> = {}
  for (const c of choices) counts[c] = (counts[c] ?? 0) + 1
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-2">
      {sorted.map(([option, count]) => {
        const pct = (count / choices.length) * 100
        return (
          <div key={option} className="flex items-center gap-3 text-sm">
            <div className="flex-1">
              <div className="flex justify-between mb-0.5">
                <span className="truncate">{option}</span>
                <span className="text-muted-foreground text-xs shrink-0 ml-2">
                  {count} ({Math.round(pct)}%)
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary/50 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Open-Ended / Text List ───────────────────────────────────────

function TextResponsesList({
  question,
  answers,
}: {
  question: SurveyQuestion
  answers: SurveyAnswer[]
}) {
  const texts = answers
    .filter((a) => a.questionId === question.id)
    .map((a) => String(a.value))
  if (texts.length === 0) return <p className="text-sm text-muted-foreground">No responses yet</p>

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {texts.map((text, i) => (
        <div
          key={i}
          className="p-3 rounded-lg bg-muted/50 text-sm leading-relaxed"
        >
          {text}
        </div>
      ))}
    </div>
  )
}

// ─── Question Result Card ─────────────────────────────────────────

function QuestionResult({
  question,
  allAnswers,
  index,
}: {
  question: SurveyQuestion
  allAnswers: SurveyAnswer[]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">
              Q{index + 1}
            </span>
            <CardTitle className="text-sm font-medium">
              {question.title}
            </CardTitle>
            <Badge variant="outline" className="text-[10px] ml-auto">
              {question.type.replace("_", " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {question.type === "nps" && (
            <NpsBreakdown question={question} answers={allAnswers} />
          )}
          {question.type === "rating" && (
            <RatingBreakdown question={question} answers={allAnswers} />
          )}
          {question.type === "multiple_choice" && (
            <ChoiceBreakdown question={question} answers={allAnswers} />
          )}
          {(question.type === "open_ended" ||
            question.type === "text_feedback") && (
            <TextResponsesList question={question} answers={allAnswers} />
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export default function SurveyResponsesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const surveyId = id as Id<"surveys">
  const survey = useQuery(api.surveys.getSurvey, {
    id: surveyId,
  }) as Survey | null | undefined
  const responses = useQuery(api.surveys.getSurveyResponses, {
    surveyId,
  }) as SurveyResponse[] | undefined
  const router = useRouter()

  if (survey === undefined || responses === undefined) {
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

  const allAnswers = responses.flatMap((r) => r.answers)

  return (
    <main className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
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
              {survey.title} — Results
            </h1>
            <p className="text-sm text-muted-foreground">
              {responses.length} response{responses.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/cms/surveys/${survey._id}`)}
        >
          Edit Survey
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Responses",
            value: responses.length,
            icon: Users,
          },
          {
            label: "Questions",
            value: survey.questions.length,
            icon: BarChart3,
          },
          {
            label: "Completion Rate",
            value:
              responses.length > 0
                ? `${Math.round(
                    (responses.filter(
                      (r) =>
                        r.answers.length === survey.questions.length
                    ).length /
                      responses.length) *
                      100
                  )}%`
                : "—",
            icon: TrendingUp,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Separator />

      {/* Question Results */}
      {responses.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No responses yet"
          description="Share your survey API endpoint to start collecting responses."
        />
      ) : (
        <div className="space-y-4">
          {survey.questions.map((q, i) => (
            <QuestionResult
              key={q.id}
              question={q}
              allAnswers={allAnswers}
              index={i}
            />
          ))}
        </div>
      )}

      <Separator />

      {/* Individual Responses */}
      {responses.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Individual Responses</h2>
          <div className="space-y-3">
            {responses.slice(0, 50).map((r, i) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
                      {r.respondentName && (
                        <span className="font-medium text-foreground">
                          {r.respondentName}
                        </span>
                      )}
                      {r.respondentEmail && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {r.respondentEmail}
                        </span>
                      )}
                      <span className="flex items-center gap-1 ml-auto">
                        <Clock className="h-3 w-3" />
                        {new Date(r.completedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {r.answers.map((a) => {
                        const q = survey.questions.find(
                          (sq) => sq.id === a.questionId
                        )
                        return (
                          <div
                            key={a.questionId}
                            className="flex items-baseline gap-2 text-sm"
                          >
                            <span className="text-muted-foreground shrink-0 text-xs">
                              {q?.title ?? a.questionId}:
                            </span>
                            <span className="font-medium">
                              {String(a.value)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
