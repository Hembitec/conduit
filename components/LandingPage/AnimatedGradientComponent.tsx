import { cn } from "@/lib/utils";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function AnimatedGradientTextComponent() {
  return (
    <Link href="/cms" className="z-10 flex items-center justify-center">
      <AnimatedGradientText>
        <Sparkles className="h-4 w-4" /> <hr className="mx-2 h-4 w-px shrink-0 bg-border" />{" "}
        <span
          className={cn(
            `inline animate-gradient bg-linear-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-size-[var(--bg-size)_100%] bg-clip-text text-transparent`,
          )}
        >
          Introducing Conduit CMS
        </span>
        <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </AnimatedGradientText>
    </Link>
  );
}

