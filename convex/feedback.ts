import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Public Mutation (called via API route — no session auth) ─────

/**
 * Called by POST /api/feedback.
 * The API route validates the API key and passes the resolved userId.
 * Screenshots must be already-uploaded R2 public URLs (max 2).
 */
export const createFeedback = mutation({
  args: {
    userId: v.id("users"),
    authorName: v.string(),
    authorEmail: v.optional(v.string()),
    type: v.union(
      v.literal("bug"),
      v.literal("feature"),
      v.literal("general")
    ),
    message: v.string(),
    pageUrl: v.optional(v.string()),
    screenshots: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    if (!args.message.trim()) throw new ConvexError("Message cannot be empty");
    if (args.message.length > 5000) throw new ConvexError("Message too long (max 5000 chars)");
    if (args.screenshots && args.screenshots.length > 2) {
      throw new ConvexError("Maximum 2 screenshots allowed");
    }

    return await ctx.db.insert("feedback", {
      userId: args.userId,
      authorName: args.authorName.trim(),
      authorEmail: args.authorEmail?.trim(),
      type: args.type,
      message: args.message.trim(),
      pageUrl: args.pageUrl?.trim(),
      screenshots: args.screenshots,
      status: "new",
    });
  },
});

// ─── Authenticated Mutations (CMS owner only) ─────────────────────

export const updateFeedbackStatus = mutation({
  args: {
    id: v.id("feedback"),
    status: v.union(
      v.literal("new"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("dismissed")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthorized");

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== userId) throw new ConvexError("Forbidden");

    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const deleteFeedback = mutation({
  args: { id: v.id("feedback") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthorized");

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== userId) throw new ConvexError("Forbidden");

    await ctx.db.delete(args.id);
  },
});

// ─── Authenticated Queries (CMS dashboard) ────────────────────────

export const getAllFeedback = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("feedback")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(200);
  },
});
