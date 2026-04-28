import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const subscribe = mutation({
  args: { email: v.string(), blogUserId: v.id("users") },
  handler: async (ctx, args) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email)) {
      throw new Error("Invalid email address");
    }

    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_user", (q) => q.eq("blogUserId", args.blogUserId))
      .filter(q => q.eq(q.field("email"), args.email))
      .first();
    
    if (existing) {
      throw new Error("You are already subscribed!");
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject as Id<"users">))
      .first();

    if (!userProfile) return [];

    return await ctx.db
      .query("subscribers")
      .withIndex("by_user", (q) => q.eq("blogUserId", identity.subject as Id<"users">))
      .order("desc")
      .collect();
  },
});

export const deleteSubscriber = mutation({
  args: { id: v.id("subscribers") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const subscriber = await ctx.db.get(args.id);
    if (!subscriber) throw new Error("Not found");
    if (subscriber.blogUserId !== identity.subject as Id<"users">) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
  },
});
