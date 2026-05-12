import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Dashboard Aggregated Summary Query ──────────────────────────
// Single round-trip that powers the entire command-center dashboard.

export const getDashboardSummary = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return {
                blog: {
                    publishedCount: 0,
                    draftCount: 0,
                    totalViews: 0,
                    topArticles: [],
                },
                outreach: {
                    totalLeads: 0,
                    newLeads: 0,
                    contactedLeads: 0,
                    emailStats: {
                        total: 0, sent: 0, opened: 0,
                        clicked: 0, bounced: 0,
                        openRate: 0, clickRate: 0, bounceRate: 0,
                    },
                    activeCampaign: null,
                },
                attention: {
                    pendingComments: 0,
                    pausedCampaigns: [] as { id: string; name: string }[],
                    draftDocuments: 0,
                },
                subscribers: 0,
            };
        }

        // ── Blogs ────────────────────────────────────────────────
        const blogs = await ctx.db
            .query("blogs")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const publishedCount = blogs.filter((b) => b.published).length;
        const draftCount = blogs.filter((b) => !b.published).length;
        const totalViews = blogs.reduce((sum, b) => sum + (b.viewCount ?? 0), 0);

        const topArticles = [...blogs]
            .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
            .slice(0, 5)
            .map((b) => ({
                id: b._id,
                title: b.title,
                slug: b.slug,
                viewCount: b.viewCount ?? 0,
                readingTime: b.readingTime ?? 0,
                published: b.published,
            }));

        // ── Leads ────────────────────────────────────────────────
        const leads = await ctx.db
            .query("leads")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const totalLeads = leads.length;
        const newLeads = leads.filter((l) => l.status === "new").length;
        const contactedLeads = leads.filter((l) => l.status === "contacted").length;

        // ── Email Logs ───────────────────────────────────────────
        const emailLogs = await ctx.db
            .query("emailLogs")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const total = emailLogs.length;
        const sent = emailLogs.filter((l) => l.status !== "queued").length;
        const opened = emailLogs.filter(
            (l) => l.status === "opened" || l.status === "clicked"
        ).length;
        const clicked = emailLogs.filter((l) => l.status === "clicked").length;
        const bounced = emailLogs.filter((l) => l.status === "bounced").length;

        // ── Active Campaign ──────────────────────────────────────
        const campaigns = await ctx.db
            .query("campaigns")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();

        const runningCampaign = campaigns.find((c) => c.status === "running");
        const activeCampaign = runningCampaign
            ? {
                  id: runningCampaign._id,
                  name: runningCampaign.name,
                  sentCount: runningCampaign.sentCount,
                  totalLeads: runningCampaign.totalLeads,
                  status: runningCampaign.status,
              }
            : null;

        const pausedCampaigns = campaigns
            .filter((c) => c.status === "paused")
            .map((c) => ({ id: c._id, name: c.name }));

        // ── Attention: Pending Comments ──────────────────────────
        const commentGroups = await Promise.all(
            blogs.map((b) =>
                ctx.db
                    .query("comments")
                    .withIndex("by_blog_and_approved", (q) =>
                        q.eq("blogId", b._id).eq("approved", false)
                    )
                    .collect()
            )
        );
        const pendingComments = commentGroups.flat().length;

        // ── Draft Documents ──────────────────────────────────────
        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();
        const draftDocuments = documents.length;

        // ── Subscribers ──────────────────────────────────────────
        const subscriberRows = await ctx.db
            .query("subscribers")
            .withIndex("by_user", (q) => q.eq("blogUserId", userId))
            .collect();

        return {
            blog: { publishedCount, draftCount, totalViews, topArticles },
            outreach: {
                totalLeads,
                newLeads,
                contactedLeads,
                emailStats: {
                    total, sent, opened, clicked, bounced,
                    openRate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
                    clickRate: sent > 0 ? Math.round((clicked / sent) * 100) : 0,
                    bounceRate: sent > 0 ? Math.round((bounced / sent) * 100) : 0,
                },
                activeCampaign,
            },
            attention: { pendingComments, pausedCampaigns, draftDocuments },
            subscribers: subscriberRows.length,
        };
    },
});
