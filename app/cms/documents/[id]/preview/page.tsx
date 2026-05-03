import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { Id } from "@/convex/_generated/dataModel";
import { notFound } from "next/navigation";
import ReactHtmlParser from 'react-html-parser';
import { transformNode } from '@/lib/transform-node';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Globe } from "lucide-react";
import { NavBar } from "@/components/NavBar";

export default async function DocumentPreview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = await convexAuthNextjsToken();
  if (!token) return notFound();

  const document = await fetchQuery(
    api.documents.getDocumentById,
    { id: id as Id<"documents"> },
    { token }
  );

  if (!document) return notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Top Banner indicating this is a preview */}
      <div className="bg-muted text-muted-foreground py-2 px-4 text-center text-sm border-b flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
          <Link href="/cms/documents">
            <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>
          </Link>
          <span className="flex-1 text-center font-medium">
            Document Preview (Not Published)
          </span>
          <div className="flex gap-2">
            <Link href={`/cms/documents/${document._id}`}>
              <Button variant="outline" size="sm" className="h-8 gap-1 px-3">
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Button>
            </Link>
            <Link href="/cms/publish">
              <Button size="sm" className="h-8 gap-1 px-3">
                <Globe className="h-3.5 w-3.5" />
                Publish
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 container max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-8">
          {document.title || "Untitled Document"}
        </h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-relaxed">
          {document.document ? (
            ReactHtmlParser(document.document, {
              transform: transformNode
            })
          ) : (
            <p className="text-muted-foreground italic">Empty document</p>
          )}
        </div>
      </main>
    </div>
  );
}
