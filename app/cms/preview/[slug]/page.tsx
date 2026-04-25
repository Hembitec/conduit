import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { ChevronLeft, Calendar, Clock, Eye } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'
import ReactHtmlParser from 'react-html-parser'
import ManageArticle from '../(components)/ManageArticle'
import { transformNode } from '@/lib/transform-node'
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Article } from "@/types"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const response = await fetchQuery(api.blogs.getArticleBySlug, { slug }) as Article | null;
  
  const readingTime = response?.blogHtml 
    ? Math.ceil(response.blogHtml.split(/\s+/).length / 200) 
    : 1;

  return (
    <main className="flex min-h-screen w-full flex-col">
      {/* Action Bar */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-3">
          <ManageArticle params={{ slug }} />
        </div>
      </div>

      {/* Article Content */}
      <article className="container relative max-w-4xl mx-auto px-4 py-8 lg:py-12">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant={response?.published ? "default" : "secondary"}>
            {response?.published ? "Published" : "Draft"}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(response?._creationTime || Date.now()).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Title */}
        <h1 className="scroll-m-20 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          {response?.title}
        </h1>

        {/* Subtitle */}
        {response?.subtitle && (
          <p className="text-lg text-muted-foreground mb-6">
            {response?.subtitle}
          </p>
        )}

        {/* Author Info */}
        <div className="flex items-center gap-3 mb-8">
          {response?.author?.profileImg && (
            <Image
              src={response.author.profileImg}
              alt={response.author.name || "Author"}
              width={48}
              height={48}
              className="rounded-full bg-muted"
            />
          )}
          <div className="flex flex-col">
            <p className="font-medium">{response?.author?.name}</p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readingTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {response?.viewCount || 0} views
              </span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {response?.image && (
          <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden">
            <Image
              src={response.image}
              alt={response?.imageAlt || response?.title || "Article cover"}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {ReactHtmlParser(response?.blogHtml || '', {
            transform: transformNode
          })}
        </div>

        <Separator className="my-12" />

        {/* Back Link */}
        <div className="flex justify-center">
          <Link
            href="/cms"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to all articles
          </Link>
        </div>
      </article>
    </main>
  )
}
