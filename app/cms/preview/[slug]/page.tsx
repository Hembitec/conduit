import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { ChevronLeft } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'
import ReactHtmlParser from 'react-html-parser'
import ManageArticle from '../(components)/ManageArticle'
import { transformNode } from '@/utils/transform-node'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await fetchQuery(api.queries.getArticleBySlug, { slug });

  return (
    <main className="flex min-w-screen flex-col items-center justify-between ">
      <ManageArticle params={{ slug }} />
      <article className="container relative max-w-3xl pt-3 pb-6 lg:pb-10">
        <div>
          <p
            className="block text-sm text-muted-foreground"
          >
            Published on {new Date(response?._creationTime).toLocaleDateString()}
          </p>
          <h1 className="scroll-m-20 text-3xl font-bold pt-4 tracking-tight lg:text-3xl">
            {response?.title}
          </h1>
          <div className="mt-4 flex items-center space-x-2">
            <Image
              src={response?.author?.profileImg || ""}
              alt={""}
              width={42}
              height={42}
              className="rounded-full bg-white"
            />
            <div className="flex flex-col text-left leading-tight">
              <p className="font-medium">
                {response?.author?.name}
              </p>
            </div>
          </div>
        </div>
        {response?.image && (
          <Image
            src={response.image}
            alt={""}
            width={720}
            height={405}
            className="my-8 rounded-md border bg-muted transition-colors"
            priority
          />
        )}
        {ReactHtmlParser(response?.blogHtml, {
          transform: transformNode
        })}
        <hr className="mt-12" />
        <div className="flex justify-center py-6 lg:py-10">
          <Link href={`/cms`}
            className={cn(buttonVariants({ variant: "ghost" }))}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            See all posts
          </Link>
        </div>
      </article>
    </main>
  )

}
