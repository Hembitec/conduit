import { NavBar } from '@/components/NavBar';
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { transformNode } from '@/utils/transform-node';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ReactHtmlParser from 'react-html-parser';
import { TrackPageView } from '@/components/TrackPageView';


export default async function Article({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await fetchQuery(api.queries.readPublicArticle, { slug: id });

  if (!data || (!data.shareable && !data.published)) {
    redirect("/")
  }

  return (
    <div className="flex flex-col justify-center items-center pb-2">
      <NavBar />
      <article className="container relative max-w-3xl py-6 lg:py-10">
        <div>
          <p
            className="block text-sm text-muted-foreground"
          >
            Published on {new Date(data?._creationTime).toLocaleDateString()}
          </p>
          <h1 className="scroll-m-20 text-3xl font-bold pt-4 tracking-tight lg:text-3xl">
            {data?.title}
          </h1>
          <div className="mt-4 flex items-center space-x-2">
            {data?.author?.profileImg && (
            <Image
              src={data.author.profileImg}
              alt={data.author.name ?? "Author"}
              width={42}
              height={42}
              className="rounded-full bg-white"
            />
          )}
            <div className="flex flex-col text-left leading-tight">
              <p className="font-medium">
                {data?.author?.name}
              </p>
            </div>
          </div>
        </div>
        <div className='flex justify-center w-full'>
          {data?.image && (
            <Image src={data.image}
              width={720}
              height={405}
              className="my-8 rounded-md border bg-muted transition-colors"
              priority
              alt='blog post' />
          )}
        </div>
        {ReactHtmlParser(data?.blogHtml, {
          transform: transformNode
        })}
        <Link href='/' target='_blank'>
          <div className="w-[225px] fixed bg-white  bottom-5 right-5 text-sm p-3 rounded border">
            <p className='text-center '>Written on <span className='font-semibold'>Conduit CMS</span></p>
          </div>
        </Link>
        {/* W3-2: fire-and-forget view count tracking */}
        <TrackPageView blogId={data._id} />
      </article>
    </div>

  );
}
