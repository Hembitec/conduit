import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Folder Queries ──────────────────────────────────────────────

export const getFoldersByUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];
        const folders = await ctx.db
            .query("leadFolders")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        // Enrich with lead counts
        return await Promise.all(
            folders.map(async (folder) => {
                const leads = await ctx.db
                    .query("leads")
                    .withIndex("by_user_and_folder", (q) =>
                        q.eq("userId", userId).eq("folderId", folder._id)
                    )
                    .collect();
                return { ...folder, leadCount: leads.length };
            })
        );
    },
});

export const getFolderById = query({
    args: { id: v.id("leadFolders") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;
        const folder = await ctx.db.get(args.id);
        if (!folder || folder.userId !== userId) return null;
        return folder;
    },
});

// ─── Folder Mutations ────────────────────────────────────────────

export const createFolder = mutation({
    args: {
        name: v.string(),
        color: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");
        if (!args.name.trim()) throw new ConvexError("Folder name is required");

        return await ctx.db.insert("leadFolders", {
            name: args.name.trim(),
            color: args.color,
            userId,
        });
    },
});

export const updateFolder = mutation({
    args: {
        id: v.id("leadFolders"),
        name: v.optional(v.string()),
        color: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");
        const folder = await ctx.db.get(args.id);
        if (!folder || folder.userId !== userId) throw new ConvexError("Not found");

        const patch: Record<string, string | undefined> = {};
        if (args.name !== undefined) patch.name = args.name.trim();
        if (args.color !== undefined) patch.color = args.color;

        await ctx.db.patch(args.id, patch);
    },
});

export const deleteFolder = mutation({
    args: { id: v.id("leadFolders") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");
        const folder = await ctx.db.get(args.id);
        if (!folder || folder.userId !== userId) throw new ConvexError("Not found");

        // Orphan leads — set folderId to undefined
        const leads = await ctx.db
            .query("leads")
            .withIndex("by_user_and_folder", (q) =>
                q.eq("userId", userId).eq("folderId", args.id)
            )
            .collect();

        for (const lead of leads) {
            await ctx.db.patch(lead._id, { folderId: undefined });
        }

        await ctx.db.delete(args.id);
    },
});
