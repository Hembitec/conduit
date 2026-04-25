import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none font-body";
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
      accent: "bg-accent text-accent-foreground hover:bg-accent/90 focus:ring-accent",
      ghost: "hover:bg-accent hover:text-accent-foreground focus:ring-accent",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-primary"
    };
    
    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 py-2 px-4 text-sm",
      lg: "h-11 px-8 text-base"
    };

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

CustomButton.displayName = "CustomButton";
