import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

export const subscribe = mutation({
  args: { email: v.string(), blogUserId: v.id("users") },
  handler: async (ctx, args) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email)) {
      throw new ConvexError("Please provide a valid email address");
    }

    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_user", (q) => q.eq("blogUserId", args.blogUserId))
      .filter(q => q.eq(q.field("email"), args.email))
      .first();
    
    if (existing) {
      throw new ConvexError("You are already subscribed to this newsletter!");
    }

    await ctx.db.insert("subscribers", {
      email: args.email,
      blogUserId: args.blogUserId,
    });
  },
});

export const getSubscribers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");

    const subs = await ctx.db
      .query("subscribers")
      .filter((q) => q.eq(q.field("blogUserId"), userId))
      .order("desc")
      .collect();

    return subs;
  },
});

export const debugSubscribers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    const allSubs = await ctx.db.query("subscribers").collect();
    return {
      currentUserId: userId,
      allSubscribers: allSubs,
    };
  },
});

export const deleteSubscriber = mutation({
  args: { id: v.id("subscribers") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");

    const subscriber = await ctx.db.get(args.id);
    if (!subscriber) throw new Error("Not found");
    if (subscriber.blogUserId !== userId) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
  },
});
