"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Wait slightly for html parser to render
    const timeout = setTimeout(() => {
      const articleContent = document.querySelector(".prose");
      if (!articleContent) return;

      const elements = Array.from(articleContent.querySelectorAll("h2, h3"));
      
      const parsedHeadings: Heading[] = elements.map((elem, index) => {
        let id = elem.id;
        if (!id) {
          id = elem.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `heading-${index}`;
          elem.id = id;
        }
        return {
          id,
          text: elem.textContent || "",
          level: elem.tagName === "H2" ? 2 : 3,
        };
      });

      setHeadings(parsedHeadings);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: "0px 0px -80% 0px" }
      );

      elements.forEach((elem) => observer.observe(elem));

      return () => observer.disconnect();
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 hidden lg:block">
      <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">
        On this page
      </h4>
      <ul className="space-y-3 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={cn(
              "transition-colors leading-tight",
              heading.level === 3 ? "ml-4" : "",
              activeId === heading.id
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
