import { NavBar } from '@/components/NavBar';
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { transformNode } from '@/lib/transform-node';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import parse from 'html-react-parser';
import { TrackPageView } from '@/components/TrackPageView';
import { ArticleComments } from '@/components/ArticleComments';
import { SocialShareButtons } from '@/components/SocialShareButtons';
import { ReadingProgressBar } from '@/components/ReadingProgressBar';
import { TableOfContents } from '@/components/TableOfContents';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { RelatedArticles } from '@/components/RelatedArticles';
import { Calendar, Clock, Eye, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PublicArticle } from '@/types';
import { Id } from '@/convex/_generated/dataModel';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchQuery(api.blogs.readPublicArticle, { slug }) as PublicArticle | null;

  if (!data) return { title: 'Article Not Found' };

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: data.title,
    description: data.metaDescription || data.subtitle || 'Read this article on Conduit CMS',
    keywords: data.keywords?.join(', '),
    authors: data.author?.name ? [{ name: data.author.name }] : undefined,
    openGraph: {
      title: data.title,
      description: data.metaDescription || data.subtitle,
      url: `/blog/${slug}`,
      siteName: 'Conduit CMS',
      images: data.image 
        ? [{ url: data.image, width: 1200, height: 630, alt: data.imageAlt || data.title }] 
        : previousImages,
      locale: 'en_US',
      type: 'article',
      publishedTime: new Date(data._creationTime).toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.metaDescription || data.subtitle,
      images: data.image ? [data.image] : [],
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await fetchQuery(api.blogs.readPublicArticle, { slug }) as PublicArticle | null;

  if (!data || (!data.shareable && !data.published)) {
    redirect("/")
  }

  const readingTime = data?.readingTime ?? 1;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.metaDescription || data.subtitle,
    image: data.image ? [data.image] : [],
    datePublished: new Date(data._creationTime).toISOString(),
    dateModified: new Date(data._creationTime).toISOString(),
    author: data.author ? [{
      '@type': 'Person',
      name: data.author.name,
      url: data.author.twitter ? `https://twitter.com/${data.author.twitter.replace('@', '')}` : undefined,
    }] : []
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <NavBar />
      <ReadingProgressBar />
      
      <article className="flex-1 container relative max-w-5xl mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-12">
        <div className="lg:w-[70%] min-w-0">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(data?._creationTime).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

        {/* Title */}
        <h1 className="scroll-m-20 text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {data?.title}
        </h1>

        {/* Subtitle */}
        {data?.subtitle && (
          <p className="text-lg text-muted-foreground mb-6">
            {data?.subtitle}
          </p>
        )}

        {/* Author & Stats */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {data?.author?.profileImg && (
            <div className="flex items-center gap-3">
              <Image
                src={data.author.profileImg}
                alt={data.author.name ?? "Author"}
                width={44}
                height={44}
                className="rounded-full bg-muted"
              />
              <div>
                <p className="font-medium">{data?.author?.name}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {readingTime} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {data?.viewCount || 0} views
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {data?.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {data.tags.map((tag) => (
              <Badge key={tag._id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Cover Image */}
        {data?.image && (
          <div className="relative w-full aspect-video mb-10 rounded-xl overflow-hidden border">
            <Image 
              src={data.image}
              alt={data?.imageAlt || data?.title || "Article cover"}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-relaxed">
          {parse(data?.blogHtml, {
            replace: transformNode
          })}
        </div>

        <Separator className="my-12" />

        {/* Author Bio */}
        {data?.author && (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 rounded-lg bg-muted/50">
            {data.author.profileImg && (
              <Image
                src={data.author.profileImg}
                alt={data.author.name || "Author"}
                width={64}
                height={64}
                className="rounded-full bg-muted"
              />
            )}
            <div className="text-center sm:text-left">
              <p className="font-semibold text-lg">{data.author.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Author of this article
              </p>
            </div>
          </div>
        )}

        {/* Social Share Buttons */}
        <div className="mt-8 mb-4">
          <SocialShareButtons title={data.title} />
        </div>

        {/* Newsletter Signup */}
        <NewsletterSignup blogUserId={data.userId} />

        {/* Related Articles */}
        {data?.tagIds && data.tagIds.length > 0 && (
          <RelatedArticles
            blogId={data._id}
            tagIds={data.tagIds as Id<"tags">[]}
          />
        )}

        {/* Comments Section */}
        <ArticleComments blogId={data._id} />

        {/* Back Link */}
        <div className="flex justify-center mt-8">
          <Link href="/blog">
            <Button variant="outline" className="gap-2">
               <ArrowLeft className="h-4 w-4" />
               Back to Blog
            </Button>
          </Link>
        </div>

        {/* W3-2: fire-and-forget view count tracking */}
        <TrackPageView blogId={data._id} />
        </div>

        <aside className="hidden lg:block lg:w-[30%] shrink-0">
          <TableOfContents />
        </aside>
      </article>

      {/* Fixed Brand Badge */}
      <Link href='/'>
        <div className="fixed bg-card bottom-5 right-5 text-sm px-4 py-2 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
          <p className='text-center'>Written on <span className='font-semibold'>Conduit CMS</span></p>
        </div>
      </Link>
    </div>
  );
}
