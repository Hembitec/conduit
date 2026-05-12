"use client";

import Link from "next/link";
import { Eye, Clock, ArrowRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TopArticle {
  id: string;
  title: string;
  slug: string;
  viewCount: number;
  readingTime: number;
  published: boolean;
}

interface DashboardTopArticlesProps {
  articles: TopArticle[];
}

export function DashboardTopArticles({ articles }: DashboardTopArticlesProps) {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-card p-6 h-full">
        <div className="flex items-center gap-2 mb-2 pb-4 border-b border-border/40">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="font-serif text-xl font-medium tracking-tight text-foreground">
            Top Articles
          </h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No articles yet. Publish your first article to see performance here.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/cms/publish">Publish Article</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-card p-6 h-full">
      <div className="flex items-center justify-between mb-2 pb-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="font-serif text-xl font-medium tracking-tight text-foreground">
            Top Articles
          </h2>
        </div>
        <Link
          href="/cms/articles"
          className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors uppercase tracking-wider"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex flex-col gap-5 pt-2">
        {articles.map((article, i) => (
          <Link
            key={article.id}
            href={`/cms/articles`}
            className="group flex items-start justify-between gap-4 hover:bg-muted/10 p-2 -mx-2 rounded-md transition-colors"
          >
            <div className="flex items-start gap-4 min-w-0">
              <span className="font-serif text-2xl text-muted-foreground/30 tabular-nums w-6 shrink-0 leading-none mt-0.5">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors text-foreground">
                  {article.title}
                </span>
                <div className="flex items-center gap-3">
                  {!article.published && (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 uppercase tracking-widest font-medium border-primary/20 text-primary">
                      Draft
                    </Badge>
                  )}
                  {article.readingTime > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{article.readingTime}m</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="font-serif text-lg tabular-nums text-foreground leading-none">
                {article.viewCount.toLocaleString()}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Views
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
