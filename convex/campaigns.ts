import { mutation, query, internalQuery } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

// ─── Campaign Queries ────────────────────────────────────────────

export const getCampaignsByUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];
        const campaigns = await ctx.db
            .query("campaigns")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();

        // Enrich with template name
        return await Promise.all(
            campaigns.map(async (campaign) => {
                const template = await ctx.db.get(campaign.templateId);
                return {
                    ...campaign,
                    templateName: template?.name ?? "Deleted Template",
                };
            })
        );
    },
});

export const getCampaignById = query({
    args: { id: v.id("campaigns") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;
        const campaign = await ctx.db.get(args.id);
        if (!campaign || campaign.userId !== userId) return null;

        const template = await ctx.db.get(campaign.templateId);
        return {
            ...campaign,
            templateName: template?.name ?? "Deleted Template",
        };
    },
});

// Internal query for cron/action access (no auth context)
export const getCampaignInternal = internalQuery({
    args: { campaignId: v.id("campaigns") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.campaignId);
    },
});

// Internal: Get all running campaigns (used by cron)
export const getRunningCampaigns = internalQuery({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("campaigns")
            .withIndex("by_status", (q) => q.eq("status", "running"))
            .collect();
    },
});

// ─── Campaign Mutations ──────────────────────────────────────────

export const createCampaign = mutation({
    args: {
        name: v.string(),
        templateId: v.id("emailTemplates"),
        senderName: v.string(),
        senderEmail: v.string(),
        targetLeadStatus: v.string(),
        rateLimitPerHour: v.number(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");

        // Verify template belongs to user
        const template = await ctx.db.get(args.templateId);
        if (!template || template.userId !== userId) {
            throw new ConvexError("Template not found");
        }

        // Count matching leads for the target status
        const matchingLeads = await ctx.db
            .query("leads")
            .withIndex("by_user_and_status", (q) =>
                q.eq("userId", userId).eq("status", args.targetLeadStatus)
            )
            .collect();

        return await ctx.db.insert("campaigns", {
            name: args.name,
            templateId: args.templateId,
            senderName: args.senderName,
            senderEmail: args.senderEmail,
            targetLeadStatus: args.targetLeadStatus,
            status: "draft",
            rateLimitPerHour: args.rateLimitPerHour,
            totalLeads: matchingLeads.length,
            sentCount: 0,
            userId,
        });
    },
});

export const startCampaign = mutation({
    args: { campaignId: v.id("campaigns") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");

        const campaign = await ctx.db.get(args.campaignId);
        if (!campaign || campaign.userId !== userId) {
            throw new ConvexError("Not found");
        }
        if (campaign.status !== "draft" && campaign.status !== "paused") {
            throw new ConvexError("Campaign can only be started from draft or paused state");
        }

        await ctx.db.patch(args.campaignId, { status: "running" });
    },
});

export const pauseCampaign = mutation({
    args: { campaignId: v.id("campaigns") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");

        const campaign = await ctx.db.get(args.campaignId);
        if (!campaign || campaign.userId !== userId) {
            throw new ConvexError("Not found");
        }
        if (campaign.status !== "running") {
            throw new ConvexError("Only running campaigns can be paused");
        }

        await ctx.db.patch(args.campaignId, { status: "paused" });
    },
});

export const deleteCampaign = mutation({
    args: { campaignId: v.id("campaigns") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");

        const campaign = await ctx.db.get(args.campaignId);
        if (!campaign || campaign.userId !== userId) {
            throw new ConvexError("Not found");
        }
        if (campaign.status === "running") {
            throw new ConvexError("Pause the campaign before deleting");
        }

        await ctx.db.delete(args.campaignId);
    },
});

// ─── Targeted / One-Off Send ─────────────────────────────────────
// Allows sending to a specific list of lead IDs immediately,
// without going through the cron batch engine.
// Creates a temporary campaign record for logging purposes,
// then fires the action directly for each selected lead.

export const sendToSelectedLeads = mutation({
    args: {
        name: v.string(),
        templateId: v.id("emailTemplates"),
        senderName: v.string(),
        senderEmail: v.string(),
        leadIds: v.array(v.id("leads")),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");

        if (args.leadIds.length === 0) {
            throw new ConvexError("Select at least one lead");
        }
        if (args.leadIds.length > 100) {
            throw new ConvexError("Maximum 100 leads per targeted send");
        }

        // Verify template belongs to user
        const template = await ctx.db.get(args.templateId);
        if (!template || template.userId !== userId) {
            throw new ConvexError("Template not found");
        }

        // Verify all leads belong to this user
        for (const leadId of args.leadIds) {
            const lead = await ctx.db.get(leadId);
            if (!lead || lead.userId !== userId) {
                throw new ConvexError(`Lead not found: ${leadId}`);
            }
        }

        // Create a campaign record (auto-completes after sending)
        const campaignId = await ctx.db.insert("campaigns", {
            name: args.name,
            templateId: args.templateId,
            senderName: args.senderName,
            senderEmail: args.senderEmail,
            targetLeadStatus: "selected",
            status: "running",
            rateLimitPerHour: 300,
            totalLeads: args.leadIds.length,
            sentCount: 0,
            userId,
        });

        // Schedule immediate send for each lead (staggered by 3 seconds)
        for (let i = 0; i < args.leadIds.length; i++) {
            await ctx.scheduler.runAfter(
                i * 3000,
                internal.outreachActions.sendEmailToLead,
                {
                    campaignId,
                    leadId: args.leadIds[i],
                    userId,
                }
            );
        }

        return { campaignId, count: args.leadIds.length };
    },
});
