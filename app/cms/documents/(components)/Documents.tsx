"use client";
import { FileText, Pencil, Timer } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Documents({ info }: { info: any }) {

  return (
    <Link href={`/cms/documents/${info?._id}`}>
      <article
        className="flex flex-col space-y-3 p-4 rounded-md border hover:border-gray-400 hover:shadow-sm min-w-[300px] transition-all cursor-pointer"
      >
        <div className='flex flex-col w-full justify-between items-start gap-2'>
          <div className='flex items-center gap-2 w-full justify-between'>
            <FileText className='text-blue-600 w-5 h-5 flex-shrink-0' />
            <span className="text-xs text-muted-foreground">
              {new Date(info?._creationTime).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
            </span>
          </div>
          <h2 className='font-bold text-base'>{info?.title}</h2>
        </div>
        <div className='flex items-center gap-2 pt-2 border-t justify-between'>
          <span className='flex items-center gap-1 text-xs text-muted-foreground'>
            <Timer className='w-3 h-3' />
            {new Date(info?._creationTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
          </span>
          <Button size="sm" variant="outline" className="gap-1 pointer-events-none">
            <Pencil className='w-3 h-3' />
            Open Editor
          </Button>
        </div>
      </article>
    </Link>
  )
}
