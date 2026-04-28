"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import Link from "next/link";
import { Clock, FileText } from "lucide-react";

interface RelatedArticlesProps {
  blogId: Id<"blogs">;
  tagIds: Id<"tags">[];
}

export function RelatedArticles({ blogId, tagIds }: RelatedArticlesProps) {
  const related = useQuery(api.blogs.getRelatedArticles, { blogId, tagIds });

  if (!related || related.length === 0) return null;

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((article) => (
          <Link
            key={article._id}
            href={`/blog/${article.slug}`}
            className="group flex flex-col rounded-lg border bg-card overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
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
                  <FileText className="w-8 h-8 text-muted-foreground/40" />
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                {article.title}
              </h3>
              {article.subtitle && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {article.subtitle}
                </p>
              )}
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3 border-t">
                {article.author && (
                  <span>{article.author.name}</span>
                )}
                {article.readingTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readingTime} min
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
