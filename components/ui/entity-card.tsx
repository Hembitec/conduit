"use client"

import { Article, Document } from "@/types"
import { Id } from "@/convex/_generated/dataModel"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Eye, FileText, Clock, Edit3, Trash2, MoreHorizontal } from "lucide-react"
import { ShareButton } from "@/app/cms/(components)/ShareButton"

interface EntityCardProps {
  variant: "article" | "document"
  data: Article | Document
  onDelete?: (id: string) => void
  onShare?: (slug: string) => void
}

export function EntityCard({ variant, data, onDelete, onShare }: EntityCardProps) {
  if (variant === "article") {
    return (
      <ArticleCard
        article={data as Article}
        onDelete={onDelete}
        onShare={onShare}
      />
    )
  }

  return (
    <DocumentCard
      document={data as Document}
      onDelete={onDelete}
    />
  )
}

function ArticleCard({
  article,
  onDelete,
  onShare,
}: {
  article: Article
  onDelete?: (id: string) => void
  onShare?: (slug: string) => void
}) {
  const isPublished = article.published

  return (
    <article className="group flex flex-col rounded-lg border bg-card overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <Link href={`/cms/preview/${article.slug}`} className="relative block">
        <div className="relative aspect-video bg-muted overflow-hidden">
          {article.image ? (
            <Image
              src={article.image}
              alt={article.imageAlt || article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="w-10 h-10 text-muted-foreground/40" />
            </div>
          )}

          <div className="absolute top-2 right-2">
            <Badge
              variant={isPublished ? "default" : "secondary"}
              className={isPublished ? "bg-primary" : undefined}
            >
              {isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/cms/preview/${article.slug}`} className="block flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="font-semibold line-clamp-2 flex-1 group-hover:text-primary transition-colors">
              {article.title}
            </h2>
            {article.category && (
              <Badge variant="outline" className="shrink-0 text-xs">
                {article.category.name}
              </Badge>
            )}
          </div>

          {article.subtitle && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {article.subtitle}
            </p>
          )}
        </Link>

        <div className="flex items-center justify-between pt-3 border-t mt-auto">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(article._creationTime).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>

            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.viewCount?.toLocaleString() || 0}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <ShareButton slug={article.slug} shareable={article.shareable} />
            <Link href={`/cms/preview/${article.slug}`}>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

function DocumentCard({
  document,
  onDelete,
}: {
  document: Document
  onDelete?: (id: string) => void
}) {
  const wordCount = document.document
    ? stripHtml(document.document).split(/\s+/).length
    : 0

  return (
    <article className="group relative flex flex-col rounded-lg border bg-card overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />

      <Link
        href={`/cms/documents/${document._id}`}
        className="block p-5 flex-1"
      >
        <div className="flex items-start gap-4 mb-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <FileText className="h-5 w-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors mb-1">
              {document.title || "Untitled Document"}
            </h2>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {getRelativeTimeString(document._creationTime)}
              </span>
              {wordCount > 0 && (
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {wordCount} words
                </span>
              )}
            </div>
          </div>
        </div>

        {document.document && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {stripHtml(document.document).slice(0, 150)}
            {stripHtml(document.document).length > 150 && "..."}
          </p>
        )}
      </Link>

      <div className="flex items-center justify-between border-t px-5 py-3 bg-muted/30">
        <span className="text-xs text-muted-foreground">
          {new Date(document._creationTime).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>

        <div className="flex items-center gap-1">
          <Link href={`/cms/documents/${document._id}`}>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3 text-xs gap-1.5"
              aria-label="Edit document"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </Link>
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(document._id)}
              aria-label="Delete document"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

function stripHtml(html: string): string {
  if (!html) return ""
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

function getRelativeTimeString(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}
