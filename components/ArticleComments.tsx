"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, User, Send } from "lucide-react"
import { toast } from "sonner"
import { ConvexError } from "convex/values"

// ─── Types ───────────────────────────────────────────────────────

interface Props {
  blogId: Id<"blogs">
}

// ─── Comment List Item ───────────────────────────────────────────

function CommentItem({ name, content, createdAt }: { name: string; content: string; createdAt: number }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
        <User className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed">{content}</p>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────

export function ArticleComments({ blogId }: Props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const comments = useQuery(api.comments.getApprovedCommentsByBlog, { blogId })
  const actCreate = useMutation(api.comments.createComment)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !content.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setSubmitting(true)
    try {
      await actCreate({ blogId, authorName: name.trim(), authorEmail: email.trim(), content: content.trim() })
      setSubmitted(true)
      setName("")
      setEmail("")
      setContent("")
    } catch (err: unknown) {
      const msg = err instanceof ConvexError ? (err.data as string) : "Failed to submit comment"
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-12" aria-label="Comments">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-xl font-bold">
          {(comments?.length ?? 0) > 0 ? `${comments!.length} Comment${comments!.length !== 1 ? "s" : ""}` : "Comments"}
        </h2>
      </div>

      {/* Comment List */}
      {(comments?.length ?? 0) > 0 ? (
        <div className="flex flex-col gap-6 mb-10">
          {comments!.map((c) => (
            <CommentItem
              key={c._id}
              name={c.authorName}
              content={c.content}
              createdAt={c._creationTime}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm mb-8">No comments yet. Be the first to leave one!</p>
      )}

      <Separator className="mb-8" />

      {/* Submit Form */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Leave a comment</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <MessageSquare className="h-10 w-10 text-primary" />
              <p className="font-medium">Thanks for your comment!</p>
              <p className="text-sm text-muted-foreground">
                It will appear after the author reviews it.
              </p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setSubmitted(false)}>
                Leave another comment
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="comment-name">Name</Label>
                  <Input
                    id="comment-name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="comment-email">Email</Label>
                  <Input
                    id="comment-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Your email won&apos;t be displayed publicly.</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="comment-content">Comment</Label>
                <Textarea
                  id="comment-content"
                  placeholder="Share your thoughts..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" disabled={submitting} className="gap-2">
                <Send className="h-4 w-4" />
                {submitting ? "Submitting..." : "Post Comment"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
