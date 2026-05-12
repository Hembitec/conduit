import { Article } from "@/types"
import { Button } from "@/components/ui/button"
import { fetchQuery } from "convex/nextjs"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { api } from "@/convex/_generated/api"
import { Plus, Newspaper } from "lucide-react"
import Link from "next/link"
import { ArticleList } from "../(components)/ArticleList"

export const metadata = {
  title: "Articles — Conduit CMS",
  description: "Manage your published and draft articles",
}

export default async function ArticlesPage() {
  const token = await convexAuthNextjsToken()
  const response = await fetchQuery(api.blogs.getAllArticles, {}, { token })
  const articles = (response || []) as Article[]

  return (
    <main className="flex w-full flex-col">
      <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Newspaper className="h-6 w-6 text-primary" />
          <div>
            <h1 className="font-bold tracking-tight text-2xl">Articles</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {articles.length} article{articles.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>

        <Link href="/cms/publish" className="shrink-0">
          <Button className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            New Article
          </Button>
        </Link>
      </div>

      <ArticleList articles={articles} />
    </main>
  )
}
