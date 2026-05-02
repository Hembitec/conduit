"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, Loader2 } from "lucide-react";

interface NewsletterSignupProps {
  blogUserId: Id<"users">;
}

export function NewsletterSignup({ blogUserId }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const subscribe = useMutation(api.subscribers.subscribe);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await subscribe({ email: email.trim(), blogUserId });
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (err: any) {
      let message = "Failed to subscribe. Please try again.";
      if (typeof err.data === "string") {
        message = err.data;
      } else if (err.message) {
        // Strip out the ugly "Uncaught Error: ConvexError: " prefixes
        message = err.message.replace(/^.*?ConvexError:\s*/, "");
      }
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-10 p-6 rounded-lg border bg-muted/30">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Subscribe to the Newsletter</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Get notified when new articles are published. No spam, unsubscribe anytime.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
          className="flex-1"
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>
    </div>
  );
}
