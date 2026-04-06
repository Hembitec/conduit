import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { readPublicArticle } from '@/utils/actions/articles/read-public-article';
import { transformNode } from '@/utils/transform-node';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ReactHtmlParser from 'react-html-parser';


export default async function Article({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = (await readPublicArticle(id)) as any[];

  if (data?.[0]?.shareable !== true) {
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
            Published on {new Date(data?.[0]?.created_at).toLocaleDateString()}
          </p>
          <h1 className="scroll-m-20 text-3xl font-bold pt-4 tracking-tight lg:text-3xl">
            {data?.[0]?.title}
          </h1>
          <div className="mt-4 flex items-center space-x-2">
            <Image
              src={data?.[0]?.author?.author_profile_img}
              alt={""}
              width={42}
              height={42}
              className="rounded-full bg-white"
            />
            <div className="flex flex-col text-left leading-tight">
              <p className="font-medium">
                {data?.[0]?.author?.author_name}
              </p>
            </div>
          </div>
        </div>
        <div className='flex justify-center w-full'>
          <Image src={data?.[0]?.image}
            width={720}
            height={405}
            className="my-8 rounded-md border bg-muted transition-colors"
            priority
            alt='blog post' />
        </div>
        {ReactHtmlParser(data?.[0]?.blog_html, {
          transform: transformNode
        })}
        <Link href='/' target='_blank'>
          <div className="w-[225px] fixed bg-white  bottom-5 right-5 text-sm p-3 rounded border">
            <p className='text-center '>Written on <span className='font-semibold'>TBD CMS</span></p>
          </div>
        </Link>
      </article>
    </div>

  );
}
