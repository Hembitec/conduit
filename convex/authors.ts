import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Author Mutations ────────────────────────────────────────────

export const createAuthor = mutation({
  args: {
    name: v.string(),
    instagram: v.optional(v.string()),
    twitter: v.optional(v.string()),
    profileImg: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthorized");
    return await ctx.db.insert("authors", { ...args, userId });
  },
});

export const updateAuthor = mutation({
  args: {
    id: v.id("authors"),
    name: v.string(),
    instagram: v.optional(v.string()),
    twitter: v.optional(v.string()),
    profileImg: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthorized");

    const author = await ctx.db.get(args.id);
    if (!author || author.userId !== userId) throw new ConvexError("Not found");

    await ctx.db.patch(args.id, {
      name: args.name,
      instagram: args.instagram,
      twitter: args.twitter,
      profileImg: args.profileImg,
    });
  },
});

export const deleteAuthor = mutation({
  args: { id: v.id("authors") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthorized");

    const author = await ctx.db.get(args.id);
    if (!author || author.userId !== userId) throw new ConvexError("Not found");

    const blogsWithAuthor = await ctx.db
      .query("blogs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("authorId"), args.id))
      .collect();

    if (blogsWithAuthor.length > 0) {
      throw new ConvexError(
        `Cannot delete author. ${blogsWithAuthor.length} article(s) reference this author.`
      );
    }

    await ctx.db.delete(args.id);
  },
});

// ─── Author Queries ──────────────────────────────────────────────

export const getAllAuthors = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];
        return await ctx.db
            .query("authors")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();
    },
});
