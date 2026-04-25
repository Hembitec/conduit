import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Document Mutations ──────────────────────────────────────────

export const createDocument = mutation({
    args: { title: v.string() },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");
        return await ctx.db.insert("documents", {
            title: args.title,
            document: "",
            userId,
        });
    },
});

export const storeDocument = mutation({
    args: {
        id: v.id("documents"),
        title: v.string(),
        document: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");
        const doc = await ctx.db.get(args.id);
        if (!doc || doc.userId !== userId) throw new Error("Not found");
        await ctx.db.patch(args.id, {
            title: args.title,
            document: args.document,
        });
    },
});

export const deleteDocument = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");
        const doc = await ctx.db.get(args.id);
        if (!doc || doc.userId !== userId) throw new Error("Not found");
        await ctx.db.delete(args.id);
    },
});

// ─── Document Queries ────────────────────────────────────────────

export const getAllDocuments = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];
        return await ctx.db
            .query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();
    },
});

export const getDocumentById = query({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;
        const doc = await ctx.db.get(args.id);
        if (!doc || doc.userId !== userId) return null;
        return doc;
    },
});
