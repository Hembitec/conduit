import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Outreach Analytics Queries ──────────────────────────────────

export const getOutreachAnalytics = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return {
                total: 0, sent: 0, opened: 0, clicked: 0, bounced: 0,
                openRate: 0, clickRate: 0, bounceRate: 0,
            };
        }

        const logs = await ctx.db
            .query("emailLogs")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const total = logs.length;
        const sent = logs.filter((l) => l.status !== "queued").length;
        const opened = logs.filter(
            (l) => l.status === "opened" || l.status === "clicked"
        ).length;
        const clicked = logs.filter((l) => l.status === "clicked").length;
        const bounced = logs.filter((l) => l.status === "bounced").length;

        return {
            total,
            sent,
            opened,
            clicked,
            bounced,
            openRate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
            clickRate: sent > 0 ? Math.round((clicked / sent) * 100) : 0,
            bounceRate: sent > 0 ? Math.round((bounced / sent) * 100) : 0,
        };
    },
});

export const getEmailLogsByDay = query({
    args: { days: v.number() },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const since = Date.now() - args.days * 86_400_000;
        const logs = await ctx.db
            .query("emailLogs")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        // Filter to date range and bucket by day
        const filteredLogs = logs.filter(
            (l) => l.sentAt && l.sentAt >= since
        );

        const buckets: Record<string, number> = {};
        const now = Date.now();
        for (let i = args.days - 1; i >= 0; i--) {
            const d = new Date(now - i * 86_400_000);
            const key = d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
            buckets[key] = 0;
        }

        for (const log of filteredLogs) {
            if (log.sentAt) {
                const key = new Date(log.sentAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                });
                if (key in buckets) buckets[key]++;
            }
        }

        return Object.entries(buckets).map(([date, count]) => ({
            date,
            count,
        }));
    },
});

export const getCampaignBreakdown = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const campaigns = await ctx.db
            .query("campaigns")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();

        return await Promise.all(
            campaigns.map(async (c) => {
                const logs = await ctx.db
                    .query("emailLogs")
                    .withIndex("by_campaign", (q) => q.eq("campaignId", c._id))
                    .collect();

                const sent = logs.filter((l) => l.status !== "queued").length;
                const opened = logs.filter(
                    (l) => l.status === "opened" || l.status === "clicked"
                ).length;
                const clicked = logs.filter((l) => l.status === "clicked").length;
                const bounced = logs.filter((l) => l.status === "bounced").length;

                return {
                    _id: c._id,
                    name: c.name,
                    status: c.status,
                    sent,
                    opened,
                    clicked,
                    bounced,
                    openRate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
                };
            })
        );
    },
});
