import { Skeleton } from "@/components/ui/skeleton"

export function DocumentCardSkeleton() {
  return (
    <article className="flex flex-col rounded-lg border bg-card overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-4 mb-3">
          <Skeleton className="h-11 w-11 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
        <Skeleton className="h-4 w-full mt-3" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </div>
      <div className="flex items-center justify-between border-t px-5 py-3 bg-muted/30">
        <Skeleton className="h-3 w-24" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-16 rounded" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </article>
  )
}
