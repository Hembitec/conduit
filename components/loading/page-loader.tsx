import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface PageLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ 
  className, 
  size = "md", 
  text = "Loading..." 
}) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 space-y-4", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizes[size])} />
      {text && (
        <p className="text-sm text-muted-foreground font-body">{text}</p>
      )}
    </div>
  );
};
