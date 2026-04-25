import { cn } from "@/lib/utils";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-background", className)}>
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-heading">Welcome</h2>
          <p className="mt-2 text-muted-foreground">Sign in to your account</p>
        </div>
        {children}
      </div>
    </div>
  );
};
