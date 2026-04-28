import { Article } from "@/types"
import { Button } from "@/components/ui/button"
import { fetchQuery } from "convex/nextjs"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { api } from "@/convex/_generated/api"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ArticleList } from "./(components)/ArticleList"

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
        
        <Link href="/cms/publish" className="shrink-0">
          <Button className="gap-2 w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4" />
            New Article
          </Button>
        </Link>
      </div>

      {/* Articles List with Search */}
      <ArticleList articles={articles} />
    </main>
  )
}
