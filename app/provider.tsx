"use client";
import React, { ReactNode, useState } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { OnboardingProvider } from "@/components/OnboardingContext";
import { OnboardingModal } from "@/components/OnboardingModal";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

export default function Provider({ children }: { children: ReactNode }) {

  return (
    <ConvexAuthNextjsProvider client={convex}>
      <OnboardingProvider>
        {children}
        <OnboardingModal />
      </OnboardingProvider>
    </ConvexAuthNextjsProvider>
  );
}