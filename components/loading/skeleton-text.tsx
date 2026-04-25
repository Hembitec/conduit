import { cn } from "@/lib/utils";
import React from "react";

interface SkeletonTextProps {
  className?: string;
  lines?: number;
  lineHeight?: "sm" | "md" | "lg";
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ 
  className, 
  lines = 1, 
  lineHeight = "md" 
}) => {
  const heights = {
    sm: "h-4",
    md: "h-5", 
    lg: "h-6"
  };

  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "bg-muted rounded-md animate-pulse",
            heights[lineHeight],
            // Vary the width for more realistic skeleton
            index === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
};
