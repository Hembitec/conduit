import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex w-full mt-4 flex-col items-start justify-between">
      <h1 className="scroll-m-20 font-semibold tracking-tight text-4xl">
        Articles
      </h1>
      <div className="flex flex-wrap justify-start items-center gap-3 mt-4 mb-20 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col space-y-2 p-4 rounded-md border max-w-[350px]"
          >
            <Skeleton className="w-full h-[200px] rounded-md" />
            <div className="flex lg:flex-row w-full justify-between items-center mt-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between items-center w-full pt-1 border-t">
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
