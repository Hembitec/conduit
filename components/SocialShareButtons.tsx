"use client";

import { X, Share2, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function SocialShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const shareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const shareLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!url) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
      <Button variant="outline" size="icon" onClick={shareTwitter} title="Share on X (Twitter)">
        <X className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={shareLinkedIn} title="Share on LinkedIn">
        <Share2 className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={copyLink} title="Copy Link">
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
      </Button>
    </div>
  );
}
