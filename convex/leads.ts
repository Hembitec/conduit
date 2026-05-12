import { mutation, query, internalQuery } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Lead Queries ────────────────────────────────────────────────

export const getLeadsByUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];
        return await ctx.db
            .query("leads")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .take(500);
    },
});

export const getLeadStats = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return { total: 0, new: 0, contacted: 0, replied: 0, bounced: 0 };

        const statuses = ["new", "contacted", "replied", "bounced"] as const;
        const counts: Record<string, number> = { total: 0 };

        for (const status of statuses) {
            const rows = await ctx.db
                .query("leads")
                .withIndex("by_user_and_status", (q) =>
                    q.eq("userId", userId).eq("status", status)
                )
                .collect();
            counts[status] = rows.length;
            counts.total += rows.length;
        }

        // Also count unsubscribed
        const unsub = await ctx.db
            .query("leads")
            .withIndex("by_user_and_status", (q) =>
                q.eq("userId", userId).eq("status", "unsubscribed")
            )
            .collect();
        counts.unsubscribed = unsub.length;
        counts.total += unsub.length;

        return counts;
    },
});

// Internal query for use by outreach actions (no auth — called from scheduled functions)
export const getLeadInternal = internalQuery({
    args: { leadId: v.id("leads") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.leadId);
    },
});

// ─── Lead Mutations ──────────────────────────────────────────────

export const bulkInsertLeads = mutation({
    args: {
        leads: v.array(
            v.object({
                email: v.string(),
                companyName: v.optional(v.string()),
                location: v.optional(v.string()),
                website: v.optional(v.string()),
                phone: v.optional(v.string()),
                decisionMakerName: v.optional(v.string()),
                title: v.optional(v.string()),
                category: v.optional(v.string()),
            })
        ),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");

        let inserted = 0;
        let skipped = 0;

        for (const lead of args.leads) {
            // Validate email format
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
                skipped++;
                continue;
            }

            // Duplicate detection using compound index
            const existing = await ctx.db
                .query("leads")
                .withIndex("by_user_and_email", (q) =>
                    q.eq("userId", userId).eq("email", lead.email.toLowerCase())
                )
                .first();

            if (existing) {
                skipped++;
                continue;
            }

            await ctx.db.insert("leads", {
                ...lead,
                email: lead.email.toLowerCase(),
                status: "new",
                userId,
            });
            inserted++;
        }

        return { inserted, skipped };
    },
});

export const insertSingleLead = mutation({
    args: {
        email: v.string(),
        companyName: v.optional(v.string()),
        decisionMakerName: v.optional(v.string()),
        title: v.optional(v.string()),
        phone: v.optional(v.string()),
        website: v.optional(v.string()),
        location: v.optional(v.string()),
        category: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");

        const email = args.email.toLowerCase().trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new ConvexError("Invalid email address");
        }

        const existing = await ctx.db
            .query("leads")
            .withIndex("by_user_and_email", (q) =>
                q.eq("userId", userId).eq("email", email)
            )
            .first();

        if (existing) {
            throw new ConvexError(`${email} is already in your leads list`);
        }

        await ctx.db.insert("leads", {
            email,
            companyName: args.companyName,
            decisionMakerName: args.decisionMakerName,
            title: args.title,
            phone: args.phone,
            website: args.website,
            location: args.location,
            category: args.category,
            status: "new",
            userId,
        });
    },
});

export const updateLeadStatus = mutation({
    args: {
        leadId: v.id("leads"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");

        const lead = await ctx.db.get(args.leadId);
        if (!lead || lead.userId !== userId) throw new ConvexError("Not found");

        await ctx.db.patch(args.leadId, { status: args.status });
    },
});

export const deleteLead = mutation({
    args: { leadId: v.id("leads") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");

        const lead = await ctx.db.get(args.leadId);
        if (!lead || lead.userId !== userId) throw new ConvexError("Not found");

        await ctx.db.delete(args.leadId);
    },
});

// ─── Category Queries ────────────────────────────────────────────

export const getLeadCategories = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];
        const leads = await ctx.db
            .query("leads")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .take(500);
        const categories = new Set<string>();
        for (const lead of leads) {
            if (lead.category) categories.add(lead.category);
        }
        return Array.from(categories).sort();
    },
});

export const getLeadsByCategory = query({
    args: { category: v.string() },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];
        return await ctx.db
            .query("leads")
            .withIndex("by_user_and_category", (q) =>
                q.eq("userId", userId).eq("category", args.category)
            )
            .order("desc")
            .take(500);
    },
});
