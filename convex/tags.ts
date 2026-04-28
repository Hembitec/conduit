import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createTag = mutation({
  args: { name: v.string(), slug: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");

    const existing = await ctx.db
      .query("tags")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();

    if (existing) {
      throw new ConvexError("Tag already exists");
    }

    return await ctx.db.insert("tags", {
      name: args.name,
      slug: args.slug,
      userId,
    });
  },
});

export const getTags = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("tags")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const deleteTag = mutation({
  args: { id: v.id("tags") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");

    const tag = await ctx.db.get(args.id);
    if (!tag) throw new ConvexError("Tag not found");
    if (tag.userId !== userId) throw new ConvexError("Unauthorized");

    await ctx.db.delete(args.id);
  },
});
