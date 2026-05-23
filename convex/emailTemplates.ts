import { mutation, query, internalQuery } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Template Queries ────────────────────────────────────────────

export const getTemplatesByUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];
        return await ctx.db
            .query("emailTemplates")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();
    },
});

export const getTemplateById = query({
    args: { id: v.id("emailTemplates") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;
        const template = await ctx.db.get(args.id);
        if (!template || template.userId !== userId) return null;
        return template;
    },
});

// Internal query for use by outreach actions (no auth — called from scheduled functions)
export const getTemplateInternal = internalQuery({
    args: { templateId: v.id("emailTemplates") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.templateId);
    },
});

// ─── Template Mutations ──────────────────────────────────────────

export const createTemplate = mutation({
    args: {
        name: v.string(),
        subject: v.string(),
        body: v.string(),
        bodyMode: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");

        return await ctx.db.insert("emailTemplates", {
            name: args.name,
            subject: args.subject,
            body: args.body,
            bodyMode: args.bodyMode ?? "html",
            userId,
        });
    },
});

export const updateTemplate = mutation({
    args: {
        id: v.id("emailTemplates"),
        name: v.optional(v.string()),
        subject: v.optional(v.string()),
        body: v.optional(v.string()),
        bodyMode: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");

        const template = await ctx.db.get(args.id);
        if (!template || template.userId !== userId) {
            throw new ConvexError("Not found");
        }

        const { id, ...updates } = args;
        // Filter out undefined values
        const patch: Record<string, string> = {};
        if (updates.name !== undefined) patch.name = updates.name;
        if (updates.subject !== undefined) patch.subject = updates.subject;
        if (updates.body !== undefined) patch.body = updates.body;
        if (updates.bodyMode !== undefined) patch.bodyMode = updates.bodyMode;

        await ctx.db.patch(id, patch);
    },
});

export const deleteTemplate = mutation({
    args: { id: v.id("emailTemplates") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");

        const template = await ctx.db.get(args.id);
        if (!template || template.userId !== userId) {
            throw new ConvexError("Not found");
        }

        await ctx.db.delete(args.id);
    },
});
