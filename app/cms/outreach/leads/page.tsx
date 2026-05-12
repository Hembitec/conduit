"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Lead } from "@/types";
import { LeadTable } from "./(components)/LeadTable";
import { ImportLeadsModal } from "./(components)/ImportLeadsModal";
import { AddLeadModal } from "./(components)/AddLeadModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

export default function LeadsPage() {
    const leadsData = useQuery(api.leads.getLeadsByUser);
    const categoriesData = useQuery(api.leads.getLeadCategories);
    const leads = (leadsData ?? []) as Lead[];
    const categories = categoriesData ?? [];
    const loading = leadsData === undefined;

    return (
        <main className="flex w-full flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border/50 pb-6 mb-8">
                <div className="flex flex-col gap-1.5">
                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Outreach
                    </p>
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground">
                            Leads
                        </h1>
                        {!loading && (
                            <span className="text-xs font-medium text-muted-foreground rounded-full border border-border/60 bg-muted/20 px-2 py-0.5">
                                {leads.length} total
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <AddLeadModal />
                    <ImportLeadsModal />
                </div>
            </div>

            {/* Loading skeleton */}
            {loading ? (
                <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-14 w-full" />
                    ))}
                </div>
            ) : (
                <LeadTable leads={leads} categories={categories} />
            )}
        </main>
    );
}
