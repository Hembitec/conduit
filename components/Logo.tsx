import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm", className)}>
      <div className="flex flex-wrap items-center justify-center gap-[2px] w-4 h-4">
        <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-primary-foreground/70 rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-primary-foreground/70 rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></div>
      </div>
    </div>
  );
}
