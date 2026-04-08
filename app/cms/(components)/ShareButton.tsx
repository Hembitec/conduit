"use client";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  slug: string;
  shareable: boolean;
}

export function ShareButton({ slug, shareable }: ShareButtonProps) {
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!shareable) {
      toast.error("Article is not public yet. Enable sharing from the article page.");
      return;
    }
    const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/article/public/${slug}`;
    navigator.clipboard.writeText(url);
    toast("Public URL copied to clipboard");
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleShare}
      title={shareable ? "Copy public URL" : "Not public yet"}
      className={shareable ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground/40"}
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
}
