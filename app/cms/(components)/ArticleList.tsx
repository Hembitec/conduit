"use client";

import { useState } from "react";
import { Article } from "@/types";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EntityCard } from "@/components/ui/entity-card";
import { EmptyState } from "@/components/EmptyState";

export function ArticleList({ articles }: { articles: Article[] }) {
  const [search, setSearch] = useState("");

  const filteredArticles = articles.filter((article) =>
    article.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {articles.length > 0 && (
        <div className="relative flex-1 sm:flex-initial mb-6 sm:mb-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full sm:w-[260px]"
            aria-label="Search articles"
          />
        </div>
      )}

      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredArticles.map((article) => (
            <EntityCard key={article._id} variant="article" data={article} />
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          No articles match &ldquo;{search}&rdquo;
        </div>
      ) : (
        <EmptyState
          title="No articles yet"
          description="Articles will show here once you've published them. Start by creating a document and publishing it."
          actionLabel="Publish Article"
          actionHref="/cms/publish"
          secondaryActionLabel="My Documents"
          secondaryActionHref="/cms/documents"
        />
      )}
    </>
  );
}
