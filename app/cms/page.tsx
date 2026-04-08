
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@/convex/_generated/api";
import { StopCircle, VerifiedIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ShareButton } from "./(components)/ShareButton"

export default async function CMS() {
  const token = await convexAuthNextjsToken();
  const response = await fetchQuery(api.queries.getAllArticles, {}, { token });
  return (
    <main className="flex w-full mt-4 flex-col items-start justify-between ">
      <h1 className="scroll-m-20 font-semibold tracking-tight text-4xl">
        Articles
      </h1>
      <div className="flex flex-wrap justify-start items-center gap-3 mt-4 mb-20 w-full">
        {response?.length > 0 ? response?.map((info: any) => (
          <article
            key={info?._id}
            className="flex flex-col space-y-2 p-4 rounded-md border max-w-[350px] hover:border-gray-300 transition-colors"
          >
            <Link href={`/cms/preview/${info?.slug}`}>
              {info?.image ? (
                <Image
                  src={info.image}
                  alt={info?.imageAlt || "article image"}
                  width={804}
                  height={452}
                  className="rounded-md border bg-muted transition-colors object-cover"
                />
              ) : (
                <div className="w-full h-[200px] rounded-md border bg-muted flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">No image</span>
                </div>
              )}
              <div className='flex lg:flex-row w-full justify-between items-center mt-2'>
                <h2 className="text-xl font-bold">{info?.title}</h2>
                <div>
                  <Badge>{info?.category?.name}</Badge>
                </div>
              </div>
              <p className="text-muted-foreground">{info?.subtitle}</p>
            </Link>
            <div className="flex justify-between items-center w-full pt-1 border-t">
              <div className="flex items-center gap-1">
                {info?.published ? <VerifiedIcon className="h-4 w-4 text-green-600" /> : <StopCircle className="h-4 w-4 text-muted-foreground" />}
                <p className="text-xs text-muted-foreground">
                  {new Date(info?._creationTime)?.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <ShareButton slug={info?.slug} shareable={info?.shareable} />
                <Link href={`/cms/preview/${info?.slug}`}>
                  <Button size="sm" variant="outline">Manage</Button>
                </Link>
              </div>
            </div>
          </article>
        ))
          :
          <main className="flex flex-col gap-2 lg:gap-2 min-h-[80vh] w-full">
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                  You have no articles
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Articles will show here once you&apos;ve published articles
                </p>
                <Link href="/cms/documents">
                  <Button>My Documents</Button>
                </Link>
              </div>
            </div>
          </main>
        }
      </div>
    </main>
  )
}
