import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Category Mutations ──────────────────────────────────────────

export const createCategory = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // Prevent duplicates for this user
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    if (existing.some((c) => c.name.toLowerCase() === args.name.toLowerCase())) {
      throw new ConvexError("Category already exists");
    }
    return await ctx.db.insert("categories", { name: args.name, userId });
  },
});

export const updateCategory = mutation({
  args: { id: v.id("categories"), name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const category = await ctx.db.get(args.id);
    if (!category || category.userId !== userId) throw new Error("Not found");

    const existing = await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    if (
      existing.some(
        (c) => c.name.toLowerCase() === args.name.toLowerCase() && c._id !== args.id
      )
    ) {
      throw new ConvexError("Category already exists");
    }

    await ctx.db.patch(args.id, { name: args.name });
  },
});

export const deleteCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const category = await ctx.db.get(args.id);
    if (!category || category.userId !== userId) throw new Error("Not found");

    const blogsWithCategory = await ctx.db
      .query("blogs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("categoryId"), args.id))
      .collect();

    if (blogsWithCategory.length > 0) {
      throw new ConvexError(
        `Cannot delete category. ${blogsWithCategory.length} article(s) reference this category.`
      );
    }

    await ctx.db.delete(args.id);
  },
});

// ─── Category Queries ────────────────────────────────────────────

export const getAllCategories = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];
        return await ctx.db
            .query("categories")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();
    },
});
