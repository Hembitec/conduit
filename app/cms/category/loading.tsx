import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CategoryLoading() {
  return (
    <main className="flex flex-col gap-4 p-4">
      <Skeleton className="h-10 w-44" />
      <Skeleton className="h-5 w-56" />
      
      <Card className="mt-4">
        <CardHeader>
          <Skeleton className="h-6 w-36" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
          
          <Skeleton className="h-10 w-36" />
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </main>
  )
}
