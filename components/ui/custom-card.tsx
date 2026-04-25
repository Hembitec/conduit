import { cn } from "@/lib/utils";
import React from "react";

interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "article" | "dashboard" | "settings";
  hover?: boolean;
}

export const CustomCard = React.forwardRef<HTMLDivElement, CustomCardProps>(
  ({ className, variant = "default", hover = true, children, ...props }, ref) => {
    const baseClasses = "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200 font-body";
    
    const variants = {
      default: "",
      article: "overflow-hidden group",
      dashboard: "p-6",
      settings: "p-4"
    };
    
    const hoverEffects = hover ? "hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5" : "";

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variants[variant], hoverEffects, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CustomCard.displayName = "CustomCard";
