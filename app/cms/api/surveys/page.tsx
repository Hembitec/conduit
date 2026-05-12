"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Copy,
  Check,
  ClipboardList,
  ArrowLeft,
  Hash,
  MessageSquare,
  List,
  Star,
  FileText,
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// ─── Reusable Code Block ──────────────────────────────────────────

function CodeBlock({
  title,
  code,
  response,
}: {
  title: string
  code: string
  response?: string
}) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Copied to clipboard")
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <Button size="icon" variant="ghost" onClick={copy} className="h-7 w-7">
          {copied ? (
            <Check className="h-3 w-3 text-primary" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      <pre className="bg-muted p-4 rounded-md overflow-x-auto">
        <code className="text-sm font-mono">{code}</code>
      </pre>
      {response && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">
            Response
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code className="text-sm font-mono">{response}</code>
          </pre>
        </div>
      )}
    </div>
  )
}

// ─── Question Type Docs ───────────────────────────────────────────

const QUESTION_DOCS = [
  {
    type: "nps",
    label: "NPS (Net Promoter Score)",
    icon: Hash,
    description:
      "Measures how likely users are to recommend your product on a scale of 0–10.",
    setup: `{
  "id": "q1",
  "type": "nps",
  "title": "How likely are you to recommend us?",
  "description": "0 = Not at all, 10 = Extremely likely",
  "required": true
}`,
    answer: `{ "questionId": "q1", "type": "nps", "value": 9 }`,
    uiGuide: `// Render a row of 11 buttons (0–10)
// Color code: 0–6 red (Detractors), 7–8 yellow (Passives), 9–10 green (Promoters)
// NPS = ((Promoters - Detractors) / Total) × 100

<div className="flex gap-1">
  {Array.from({ length: 11 }, (_, i) => (
    <button
      key={i}
      onClick={() => setScore(i)}
      className={cn(
        "h-10 w-10 rounded-lg border font-mono text-sm",
        score === i && "ring-2 ring-primary",
        i <= 6 && "hover:bg-red-50",
        (i === 7 || i === 8) && "hover:bg-yellow-50",
        i >= 9 && "hover:bg-green-50"
      )}
    >
      {i}
    </button>
  ))}
</div>
<div className="flex justify-between text-xs mt-1">
  <span>Not likely</span>
  <span>Extremely likely</span>
</div>`,
  },
  {
    type: "open_ended",
    label: "Open-Ended",
    icon: MessageSquare,
    description:
      "Free-text question for qualitative insights. Max 5000 characters.",
    setup: `{
  "id": "q2",
  "type": "open_ended",
  "title": "What would you improve about our product?",
  "description": "Be as specific as possible",
  "required": false
}`,
    answer: `{ "questionId": "q2", "type": "open_ended", "value": "The onboarding flow is confusing" }`,
    uiGuide: `// Simple textarea with character counter
<div>
  <textarea
    value={text}
    onChange={(e) => setText(e.target.value)}
    maxLength={5000}
    rows={4}
    placeholder="Share your thoughts..."
    className="w-full p-3 border rounded-lg resize-y"
  />
  <p className="text-xs text-right mt-1">
    {text.length}/5000
  </p>
</div>`,
  },
  {
    type: "multiple_choice",
    label: "Multiple Choice",
    icon: List,
    description:
      "Let users pick from predefined options. Define 2–20 choices.",
    setup: `{
  "id": "q3",
  "type": "multiple_choice",
  "title": "How did you hear about us?",
  "required": true,
  "options": [
    "Google Search",
    "Social Media",
    "Friend / Colleague",
    "Blog Post",
    "Other"
  ]
}`,
    answer: `{ "questionId": "q3", "type": "multiple_choice", "value": "Social Media" }`,
    uiGuide: `// Render each option as a selectable card
{question.options.map((option) => (
  <button
    key={option}
    onClick={() => setSelected(option)}
    className={cn(
      "w-full text-left p-3 rounded-lg border transition",
      selected === option
        ? "border-primary bg-primary/5 font-medium"
        : "hover:border-primary/50"
    )}
  >
    <div className="flex items-center gap-3">
      <div className={cn(
        "h-5 w-5 rounded-full border-2",
        selected === option && "border-primary bg-primary"
      )} />
      <span>{option}</span>
    </div>
  </button>
))}`,
  },
  {
    type: "rating",
    label: "Rating Scale",
    icon: Star,
    description:
      "Collect satisfaction scores on a configurable 1–N scale with custom labels.",
    setup: `{
  "id": "q4",
  "type": "rating",
  "title": "Rate your experience with our support team",
  "required": true,
  "ratingScale": 5,
  "ratingLabels": {
    "low": "Very Unsatisfied",
    "high": "Very Satisfied"
  }
}`,
    answer: `{ "questionId": "q4", "type": "rating", "value": 4 }`,
    uiGuide: `// Star or number buttons with labels
const scale = question.ratingScale ?? 5;

<div>
  <div className="flex gap-1">
    {Array.from({ length: scale }, (_, i) => i + 1).map((n) => (
      <button
        key={n}
        onClick={() => setRating(n)}
        className={cn(
          "h-12 w-12 rounded-lg border text-lg font-medium",
          rating === n ? "bg-primary text-white" : "hover:bg-muted"
        )}
      >
        {n}
      </button>
    ))}
  </div>
  <div className="flex justify-between text-xs mt-2">
    <span>{question.ratingLabels?.low}</span>
    <span>{question.ratingLabels?.high}</span>
  </div>
</div>`,
  },
  {
    type: "text_feedback",
    label: "Text Feedback",
    icon: FileText,
    description:
      "Categorized feedback with a type selector (bug, feature, general) and a message field.",
    setup: `{
  "id": "q5",
  "type": "text_feedback",
  "title": "Share any feedback or report a bug",
  "required": false
}`,
    answer: `{ "questionId": "q5", "type": "text_feedback", "value": "bug: The save button doesn't work on mobile" }`,
    uiGuide: `// Category picker + textarea combo
<div className="space-y-3">
  <div className="flex gap-2">
    {['bug', 'feature', 'general'].map((t) => (
      <button
        key={t}
        onClick={() => setType(t)}
        className={cn(
          "px-3 py-1.5 rounded-full text-sm border",
          type === t ? "bg-primary text-white" : "hover:bg-muted"
        )}
      >
        {t === 'bug' ? '🐛 Bug' : t === 'feature' ? '💡 Feature' : '💬 General'}
      </button>
    ))}
  </div>
  <textarea
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    maxLength={5000}
    rows={3}
    placeholder="Describe in detail..."
    className="w-full p-3 border rounded-lg"
  />
</div>`,
  },
]

// ─── Page ─────────────────────────────────────────────────────────

export default function SurveyApiDocsPage() {
  const router = useRouter()

  return (
    <main className="w-full max-w-3xl mx-auto pb-20">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/cms/api")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Survey API Documentation
            </h1>
            <p className="text-muted-foreground">
              Build multi-question surveys with NPS, ratings, multiple choice,
              and open-ended questions.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Fetch Survey */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Fetch Survey</CardTitle>
                <CardDescription>
                  Returns the survey structure (questions only, no responses).
                  Use this to render the survey form in your app.
                </CardDescription>
              </div>
              <Badge>GET</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <CodeBlock
              title="Request"
              code={`const response = await fetch(
  'https://your-domain.com/api/surveys/product-nps-q2',
  {
    headers: { 'X-Auth-Key': 'YOUR_API_KEY' }
  }
);
const { data } = await response.json();
// data.questions — array of question objects
// data.settings — survey configuration`}
              response={`// 200 OK
{
  "status": 200,
  "data": {
    "_id": "...",
    "title": "Product NPS Q2 2026",
    "description": "Help us improve!",
    "slug": "product-nps-q2",
    "questions": [
      {
        "id": "q1",
        "type": "nps",
        "title": "How likely are you to recommend us?",
        "required": true
      },
      {
        "id": "q2",
        "type": "rating",
        "title": "Rate your support experience",
        "required": true,
        "ratingScale": 5,
        "ratingLabels": { "low": "Poor", "high": "Excellent" }
      }
    ],
    "settings": {
      "allowAnonymous": true,
      "requireEmail": false,
      "showProgress": true
    }
  }
}`}
            />
          </CardContent>
        </Card>

        {/* Submit Response */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Submit Response</CardTitle>
                <CardDescription>
                  Submit answers to a survey. Each answer must match the
                  question type and pass validation.
                </CardDescription>
              </div>
              <Badge variant="secondary">POST</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <CodeBlock
              title="Request"
              code={`const response = await fetch(
  'https://your-domain.com/api/surveys/product-nps-q2/respond',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Key': 'YOUR_API_KEY',
    },
    body: JSON.stringify({
      respondentName: 'Jane Smith',       // optional
      respondentEmail: 'jane@example.com', // optional
      answers: [
        { questionId: 'q1', type: 'nps', value: 9 },
        { questionId: 'q2', type: 'rating', value: 4 },
      ],
      pageUrl: 'https://app.example.com/settings', // optional
    }),
  }
);`}
              response={`// 201 Created
{ "status": 201, "message": "Response submitted successfully" }

// 404 Not Found
{ "status": 404, "message": "Survey not found or not active" }

// 422 Validation Error
{ "status": 422, "message": "NPS score must be between 0 and 10" }
{ "status": 422, "message": "Missing required answers for: q1" }`}
            />
          </CardContent>
        </Card>

        {/* Question Types Guide */}
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <ClipboardList className="h-5 w-5 text-primary" />
            Question Types & UI Guide
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Each question type has specific validation rules and recommended UI
            patterns. Below is the complete reference for building beautiful
            survey forms.
          </p>

          <div className="space-y-6">
            {QUESTION_DOCS.map((doc) => (
              <Card key={doc.type}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <doc.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{doc.label}</CardTitle>
                      <CardDescription>{doc.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CodeBlock title="Question Definition (in survey)" code={doc.setup} />
                  <CodeBlock title="Answer Format (in submission)" code={doc.answer} />
                  <CodeBlock
                    title="Recommended UI (React/JSX)"
                    code={doc.uiGuide}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Complete Widget Example */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Complete Survey Widget — Drop-in Example
            </CardTitle>
            <CardDescription>
              Fetch a survey, render it dynamically, and submit responses.
              Works with any framework.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock
              title="Full Implementation (Vanilla JS)"
              code={`const DOMAIN = 'https://your-domain.com';
const API_KEY = 'YOUR_API_KEY';

// 1. Fetch the survey structure
async function loadSurvey(slug) {
  const res = await fetch(DOMAIN + '/api/surveys/' + slug, {
    headers: { 'X-Auth-Key': API_KEY },
  });
  const { data } = await res.json();
  return data; // { title, questions, settings }
}

// 2. Build a form dynamically based on question types
function renderQuestion(question) {
  switch (question.type) {
    case 'nps':
      // Render 0-10 buttons
      break;
    case 'rating':
      // Render 1-N scale with labels
      break;
    case 'multiple_choice':
      // Render radio buttons from question.options
      break;
    case 'open_ended':
    case 'text_feedback':
      // Render textarea
      break;
  }
}

// 3. Submit all answers
async function submitSurvey(slug, answers, respondent) {
  const res = await fetch(DOMAIN + '/api/surveys/' + slug + '/respond', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Key': API_KEY,
    },
    body: JSON.stringify({
      respondentName: respondent.name,
      respondentEmail: respondent.email,
      answers, // [{ questionId, type, value }, ...]
    }),
  });
  return res.ok;
}

// Usage:
const survey = await loadSurvey('product-nps-q2');
survey.questions.forEach(renderQuestion);
// ... collect answers from form ...
await submitSurvey('product-nps-q2', collectedAnswers, { name: 'Jane' });`}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
