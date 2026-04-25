import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Create Document
        </Button>
      </div>
      <div className="flex justify-start flex-wrap items-center gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-3 p-4 rounded-md border max-w-[350px] w-full"
          >
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
