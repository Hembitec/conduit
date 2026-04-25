"use client";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect, useRef } from "react";

export function TrackPageView({ blogId }: { blogId: string }) {
  const trackView = useMutation(api.analytics.trackPageView);
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackView({ blogId: blogId as Id<"blogs"> }).catch(() => {
      // silently ignore — tracking is non-critical
    });
  }, [blogId, trackView]);

  return null;
}
