"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"

interface RelatedArticlesProps {
  blogId: Id<"blogs">
  tagIds: Id<"tags">[]
}

export function RelatedArticles({ blogId, tagIds }: RelatedArticlesProps) {
  const relatedArticles = useQuery(api.blogs.getRelatedArticles, { blogId, tagIds })

  if (!relatedArticles || relatedArticles.length === 0) {
    return null
  }

  return (
    <div className="mt-16 mb-8 border-t pt-10">
      <h3 className="text-2xl font-bold mb-6 tracking-tight">Related Articles</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {relatedArticles.map((article) => (
          <Link href={`/blog/${article.slug}`} key={article._id} className="group block h-full">
            <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/50 flex flex-col">
              {article.image && (
                <div className="relative w-full h-40 overflow-hidden bg-muted">
                  <Image
                    src={article.image}
                    alt={article.imageAlt || article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <CardContent className="p-5 flex flex-col flex-1">
                {article.category && (
                  <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">
                    {article.category.name}
                  </p>
                )}
                <h4 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
                {article.subtitle && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {article.subtitle}
                  </p>
                )}
                <div className="mt-auto pt-4 flex items-center text-xs text-muted-foreground">
                  <time dateTime={new Date(article._creationTime).toISOString()}>
                    {format(new Date(article._creationTime), "MMM d, yyyy")}
                  </time>
                  {article.readingTime && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{article.readingTime} min read</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
