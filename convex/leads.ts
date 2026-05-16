import { mutation, query, internalQuery } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Lead Queries ────────────────────────────────────────────────

export const getLeadsByUser = query({
    args: { folderId: v.optional(v.id("leadFolders")) },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];
        if (args.folderId) {
            return await ctx.db
                .query("leads")
                .withIndex("by_user_and_folder", (q) =>
                    q.eq("userId", userId).eq("folderId", args.folderId)
                )
                .order("desc")
                .take(500);
        }
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
                customFields: v.optional(v.record(v.string(), v.string())),
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
        customFields: v.optional(v.record(v.string(), v.string())),
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

// ─── Bulk Operations ─────────────────────────────────────────────

export const bulkDeleteLeads = mutation({
    args: { leadIds: v.array(v.id("leads")) },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");
        if (args.leadIds.length > 100) {
            throw new ConvexError("Maximum 100 leads per bulk delete");
        }
        let deleted = 0;
        for (const leadId of args.leadIds) {
            const lead = await ctx.db.get(leadId);
            if (lead && lead.userId === userId) {
                await ctx.db.delete(leadId);
                deleted++;
            }
        }
        return { deleted };
    },
});

export const bulkUpdateLeadStatus = mutation({
    args: {
        leadIds: v.array(v.id("leads")),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");
        if (args.leadIds.length > 100) {
            throw new ConvexError("Maximum 100 leads per bulk update");
        }
        let updated = 0;
        for (const leadId of args.leadIds) {
            const lead = await ctx.db.get(leadId);
            if (lead && lead.userId === userId) {
                await ctx.db.patch(leadId, { status: args.status });
                updated++;
            }
        }
        return { updated };
    },
});

export const updateLead = mutation({
    args: {
        leadId: v.id("leads"),
        email: v.optional(v.string()),
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
        const lead = await ctx.db.get(args.leadId);
        if (!lead || lead.userId !== userId) throw new ConvexError("Not found");

        const { leadId, ...updates } = args;
        const patch: Record<string, string | undefined> = {};
        if (updates.email !== undefined) {
            const email = updates.email.toLowerCase().trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                throw new ConvexError("Invalid email address");
            }
            patch.email = email;
        }
        if (updates.companyName !== undefined) patch.companyName = updates.companyName;
        if (updates.decisionMakerName !== undefined) patch.decisionMakerName = updates.decisionMakerName;
        if (updates.title !== undefined) patch.title = updates.title;
        if (updates.phone !== undefined) patch.phone = updates.phone;
        if (updates.website !== undefined) patch.website = updates.website;
        if (updates.location !== undefined) patch.location = updates.location;
        if (updates.category !== undefined) patch.category = updates.category;

        await ctx.db.patch(leadId, patch);
    },
});

export const bulkMoveToFolder = mutation({
    args: {
        leadIds: v.array(v.id("leads")),
        folderId: v.optional(v.id("leadFolders")),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");
        if (args.leadIds.length > 100) {
            throw new ConvexError("Maximum 100 leads per bulk move");
        }
        // Verify folder belongs to user (if provided)
        if (args.folderId) {
            const folder = await ctx.db.get(args.folderId);
            if (!folder || folder.userId !== userId) {
                throw new ConvexError("Folder not found");
            }
        }
        let moved = 0;
        for (const leadId of args.leadIds) {
            const lead = await ctx.db.get(leadId);
            if (lead && lead.userId === userId) {
                await ctx.db.patch(leadId, { folderId: args.folderId });
                moved++;
            }
        }
        return { moved };
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

// ─── Custom Field Keys ───────────────────────────────────────────

export const getCustomFieldKeys = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];
        const leads = await ctx.db
            .query("leads")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .take(500);
        const keys = new Set<string>();
        for (const lead of leads) {
            if (lead.customFields) {
                for (const key of Object.keys(lead.customFields)) keys.add(key);
            }
        }
        return Array.from(keys).sort();
    },
});

// ─── Matching Lead Preview (for Campaign creation) ───────────────

export const getMatchingLeadPreview = query({
    args: {
        status: v.string(),
        category: v.optional(v.string()),
        folderId: v.optional(v.id("leadFolders")),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return { count: 0, samples: [] };

        let leads = await ctx.db
            .query("leads")
            .withIndex("by_user_and_status", (q) =>
                q.eq("userId", userId).eq("status", args.status)
            )
            .collect();

        if (args.category) {
            leads = leads.filter((l) => l.category === args.category);
        }
        if (args.folderId) {
            leads = leads.filter((l) => l.folderId === args.folderId);
        }

        return {
            count: leads.length,
            samples: leads.slice(0, 5).map((l) => ({
                _id: l._id,
                email: l.email,
                name: l.decisionMakerName ?? null,
                company: l.companyName ?? null,
            })),
        };
    },
});
