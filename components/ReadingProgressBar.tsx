"use client";

import { useEffect, useState } from "react";

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollHeight === clientHeight) {
        setProgress(0);
        return;
      }
      const windowHeight = scrollHeight - clientHeight;
      const currentProgress = (scrollTop / windowHeight) * 100;
      setProgress(currentProgress);
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress(); // Initial check

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
      <div
        className="h-full bg-primary transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
