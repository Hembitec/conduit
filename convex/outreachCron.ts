import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// ─── Cron Processing ─────────────────────────────────────────────
// Called every 5 minutes by the cron job to process active campaigns.
// This mutation reads running campaigns, picks unsent leads, and
// schedules sendEmailToLead actions with staggered delays.

export const processActiveCampaigns = internalMutation({
    args: {},
    handler: async (ctx) => {
        const campaigns = await ctx.db
            .query("campaigns")
            .withIndex("by_status", (q) => q.eq("status", "running"))
            .collect();

        for (const campaign of campaigns) {
            // Guard 1: If we've already sent to all intended leads, complete the campaign
            const remaining = campaign.totalLeads - campaign.sentCount;
            if (remaining <= 0) {
                await ctx.db.patch(campaign._id, { status: "completed" });
                continue;
            }

            // Guard 2: Cap batch size to the LESSER of rate-limit batch and remaining leads
            const rateBatch = Math.max(1, Math.floor(campaign.rateLimitPerHour / 12));
            const batchSize = Math.min(rateBatch, remaining);

            // Find leads matching the target status for this campaign's user
            // We fetch extra to allow for dedup + category/folder filtering below
            let candidateLeads = await ctx.db
                .query("leads")
                .withIndex("by_user_and_status", (q) =>
                    q.eq("userId", campaign.userId).eq("status", campaign.targetLeadStatus)
                )
                .take(batchSize * 5);

            // Filter by category and folder if specified on the campaign
            if (campaign.targetCategory) {
                candidateLeads = candidateLeads.filter(
                    (l) => l.category === campaign.targetCategory
                );
            }
            if (campaign.targetFolderId) {
                candidateLeads = candidateLeads.filter(
                    (l) => l.folderId === campaign.targetFolderId
                );
            }

            if (candidateLeads.length === 0) {
                // No more leads to send — mark campaign as completed
                await ctx.db.patch(campaign._id, { status: "completed" });
                continue;
            }

            // Guard 3: Dedup — skip leads already emailed in THIS campaign
            const existingLogs = await ctx.db
                .query("emailLogs")
                .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
                .collect();
            const alreadySentLeadIds = new Set(existingLogs.map((log) => log.leadId));

            const leads = candidateLeads
                .filter((lead) => !alreadySentLeadIds.has(lead._id))
                .slice(0, batchSize);

            if (leads.length === 0) {
                // All matching leads already emailed — complete the campaign
                await ctx.db.patch(campaign._id, { status: "completed" });
                continue;
            }

            // Stagger emails across the 5-minute window (300,000ms)
            const delayBetween = leads.length > 1
                ? Math.floor(300000 / leads.length)
                : 0;

            for (let i = 0; i < leads.length; i++) {
                await ctx.scheduler.runAfter(
                    i * delayBetween,
                    internal.outreachActions.sendEmailToLead,
                    {
                        campaignId: campaign._id,
                        leadId: leads[i]._id,
                        userId: campaign.userId,
                    }
                );
            }
        }
    },
});

// ─── Email Log Mutations ─────────────────────────────────────────
// Called by the outreachActions after sending (or failing to send) an email.

export const logEmailResult = internalMutation({
    args: {
        campaignId: v.id("campaigns"),
        leadId: v.id("leads"),
        userId: v.id("users"),
        brevoMessageId: v.optional(v.string()),
        success: v.boolean(),
        errorMessage: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Insert email log
        await ctx.db.insert("emailLogs", {
            campaignId: args.campaignId,
            leadId: args.leadId,
            brevoMessageId: args.brevoMessageId,
            status: args.success ? "sent" : "bounced",
            sentAt: args.success ? Date.now() : undefined,
            errorMessage: args.errorMessage,
            userId: args.userId,
        });

        if (args.success) {
            // Increment campaign sent count
            const campaign = await ctx.db.get(args.campaignId);
            if (campaign) {
                await ctx.db.patch(args.campaignId, {
                    sentCount: campaign.sentCount + 1,
                });
            }

            // Mark lead as contacted
            await ctx.db.patch(args.leadId, { status: "contacted" });
        }
    },
});

// ─── Webhook Processing ──────────────────────────────────────────
// Called by the HTTP endpoint when Brevo sends a webhook event.

export const updateEmailLogFromWebhook = internalMutation({
    args: {
        brevoMessageId: v.string(),
        event: v.string(),
        timestamp: v.float64(),
    },
    handler: async (ctx, args) => {
        const log = await ctx.db
            .query("emailLogs")
            .withIndex("by_brevoMessageId", (q) =>
                q.eq("brevoMessageId", args.brevoMessageId)
            )
            .first();

        if (!log) return; // Unknown message ID — ignore

        // Map Brevo events to our status values (idempotent)
        switch (args.event) {
            case "delivered":
                if (log.status === "sent") {
                    await ctx.db.patch(log._id, { status: "delivered" });
                }
                break;

            case "opened":
            case "uniqueOpened":
                await ctx.db.patch(log._id, {
                    status: "opened",
                    openedAt: args.timestamp,
                });
                break;

            case "click":
            case "clicked":
                await ctx.db.patch(log._id, {
                    status: "clicked",
                    clickedAt: args.timestamp,
                });
                break;

            case "hardBounce":
            case "softBounce":
            case "blocked":
            case "spam":
                await ctx.db.patch(log._id, { status: "bounced" });
                // Also mark the lead as bounced
                await ctx.db.patch(log.leadId, { status: "bounced" });
                break;

            case "unsubscribed":
                await ctx.db.patch(log.leadId, { status: "unsubscribed" });
                break;
        }
    },
});

// ─── Analytics Queries ───────────────────────────────────────────

export const getOutreachStats = internalQuery({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const logs = await ctx.db
            .query("emailLogs")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();

        const total = logs.length;
        const sent = logs.filter((l) => l.status !== "queued").length;
        const opened = logs.filter((l) => l.status === "opened" || l.status === "clicked").length;
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

// ─── Dedup Check (used by sendEmailToLead action) ────────────────

export const hasAlreadySentToLead = internalQuery({
    args: {
        campaignId: v.id("campaigns"),
        leadId: v.id("leads"),
    },
    handler: async (ctx, args) => {
        const existingLog = await ctx.db
            .query("emailLogs")
            .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
            .filter((q) => q.eq(q.field("leadId"), args.leadId))
            .first();
        return existingLog !== null;
    },
});

