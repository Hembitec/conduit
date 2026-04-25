"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { motion } from "framer-motion"
import { 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ExternalLink,
  Clock,
  CheckCheck,
  Filter,
  Search,
  User,
  Mail
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/EmptyState"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { Id } from "@/convex/_generated/dataModel"

interface Comment {
  _id: Id<"comments">
  _creationTime: number
  blogId: Id<"blogs">
  authorName: string
  authorEmail: string
  content: string
  approved: boolean
  blogTitle?: string
}

type FilterStatus = "all" | "pending" | "approved" | "rejected"

function CommentStats({ comments }: { comments: Comment[] }) {
  const stats = {
    total: comments.length,
    pending: comments.filter(c => !c.approved).length,
    approved: comments.filter(c => c.approved).length,
  }

  const statCards = [
    { label: "Total", value: stats.total, icon: MessageSquare, color: "text-primary" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-500" },
    { label: "Approved", value: stats.approved, icon: CheckCheck, color: "text-green-500" },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
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

function CommentCard({ 
  comment, 
  onApprove, 
  onReject, 
  onDelete,
  isLoading 
}: { 
  comment: Comment
  onApprove: (id: Id<"comments">) => void
  onReject: (id: Id<"comments">) => void
  onDelete: (id: Id<"comments">) => void
  isLoading: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "group rounded-lg border bg-card p-4 transition-all hover:shadow-md",
        !comment.approved && "border-yellow-500/30 bg-yellow-50/5 dark:bg-yellow-950/5"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User className="h-5 w-5 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-sm">{comment.authorName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span>{comment.authorEmail}</span>
              </div>
            </div>
            <Badge variant={comment.approved ? "default" : "secondary"}>
              {comment.approved ? "Approved" : "Pending"}
            </Badge>
          </div>

          <Separator className="my-3" />

          {/* Comment text */}
          <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>

          {/* Article reference */}
          {comment.blogTitle && (
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span>On:</span>
              <span className="font-medium text-foreground">{comment.blogTitle}</span>
              <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs">
                <ExternalLink className="h-3 w-3" />
                View
              </Button>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex items-center gap-2">
            {!comment.approved ? (
              <Button
                size="sm"
                className="gap-1"
                onClick={() => onApprove(comment._id)}
                disabled={isLoading}
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={() => onReject(comment._id)}
                disabled={isLoading}
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="gap-1 text-destructive hover:text-destructive"
              onClick={() => onDelete(comment._id)}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function CommentsPage() {
  const [filter, setFilter] = useState<FilterStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const comments = useQuery(api.comments.getAllComments) || []
  const approveComment = useMutation(api.comments.approveComment)
  const deleteComment = useMutation(api.comments.deleteComment)

  const filteredComments = comments.filter(comment => {
    const matchesFilter = 
      filter === "all" ? true :
      filter === "pending" ? !comment.approved :
      filter === "approved" ? comment.approved :
      true
    
    const matchesSearch = 
      searchQuery === "" ||
      comment.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.blogTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  async function handleApprove(id: Id<"comments">) {
    setIsLoading(true)
    try {
      await approveComment({ id, approved: true })
      toast.success("Comment approved")
    } catch {
      toast.error("Failed to approve comment")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleReject(id: Id<"comments">) {
    setIsLoading(true)
    try {
      await approveComment({ id, approved: false })
      toast.success("Comment rejected")
    } catch {
      toast.error("Failed to reject comment")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: Id<"comments">) {
    setIsLoading(true)
    try {
      await deleteComment({ id })
      toast.success("Comment deleted")
    } catch {
      toast.error("Failed to delete comment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex flex-col gap-6 p-4 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Comments</h1>
            <p className="text-muted-foreground">
              Moderate comments on your published articles
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <CommentStats comments={comments} />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              {comments.filter(c => !c.approved).length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {comments.filter(c => !c.approved).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full sm:w-[250px]"
          />
        </div>
      </motion.div>

      {/* Comments List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        {filteredComments.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title={searchQuery ? "No comments found" : "No comments yet"}
            description={
              searchQuery
                ? "Try adjusting your search or filters"
                : "Comments will appear here when readers leave feedback on your articles"
            }
            action={
              searchQuery ? {
                label: "Clear filters",
                onClick: () => { setSearchQuery(""); setFilter("all") }
              } : undefined
            }
          />
        ) : (
          filteredComments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          ))
        )}
      </motion.div>
    </main>
  )
}
