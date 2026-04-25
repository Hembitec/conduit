import { Article } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EntityCard } from "@/components/ui/entity-card"
import { fetchQuery } from "convex/nextjs"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { api } from "@/convex/_generated/api"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { EmptyState } from "@/components/EmptyState"

export default async function CMS() {
  const token = await convexAuthNextjsToken()
  const response = await fetchQuery(api.blogs.getAllArticles, {}, { token })
  const articles = (response || []) as Article[]

  return (
    <main className="flex w-full flex-col">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-bold tracking-tight text-3xl">
            Articles
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your published and draft articles
          </p>
        </div>
        
        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-9 w-full sm:w-[260px]"
              aria-label="Search articles"
            />
          </div>
          
          <Link href="/cms/publish" className="shrink-0">
            <Button className="gap-2 w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4" />
              New Article
            </Button>
          </Link>
        </div>
      </div>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {articles.map((article) => (
            <EntityCard key={article._id} variant="article" data={article} />
          ))}
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
    </main>
  )
}

