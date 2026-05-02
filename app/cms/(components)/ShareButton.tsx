"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface ShareButtonProps {
  slug: string;
  shareable: boolean;
}

export function ShareButton({ slug, shareable }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/blog/${slug}`;

  const handleCopy = async () => {
    if (!shareable) {
      toast.error("Article is not public yet. Enable sharing from the article page.");
      return;
    }
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("Public URL copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          title={shareable ? "Share article" : "Not public yet"}
          className={shareable ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground/40"}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-3">
          <div className="space-y-1">
            <h4 className="font-medium leading-none">Share Article</h4>
            <p className="text-sm text-muted-foreground">
              {shareable
                ? "Copy the public URL to share this article."
                : "This article is not public yet."}
            </p>
          </div>
          {shareable ? (
            <div className="grid gap-2">
              <Label htmlFor="share-url">Public URL</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="share-url"
                  value={publicUrl}
                  readOnly
                  className="text-xs"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm text-muted-foreground">
                Enable sharing from the article management page to make this article public.
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
