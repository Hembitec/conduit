import { cn } from "@/lib/utils";
import React from "react";

interface SkeletonCardProps {
  className?: string;
  showImage?: boolean;
  lines?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ 
  className, 
  showImage = true, 
  lines = 3 
}) => {
  return (
    <div className={cn("rounded-lg border bg-card p-4 space-y-3", className)}>
      {showImage && (
        <div className="w-full h-48 bg-muted rounded-md animate-pulse" />
      )}
      <div className="space-y-2">
        <div className="h-6 bg-muted rounded-md animate-pulse w-3/4" />
        <div className="h-4 bg-muted rounded-md animate-pulse w-full" />
        {lines > 2 && (
          <div className="h-4 bg-muted rounded-md animate-pulse w-5/6" />
        )}
        {lines > 3 && (
          <div className="h-4 bg-muted rounded-md animate-pulse w-4/6" />
        )}
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-4 bg-muted rounded-md animate-pulse w-20" />
        <div className="h-8 bg-muted rounded-md animate-pulse w-16" />
      </div>
    </div>
  );
};
