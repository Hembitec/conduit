import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Analytics Mutations ─────────────────────────────────────────

export const trackPageView = mutation({
    args: { blogId: v.id("blogs") },
    handler: async (ctx, args) => {
        const blog = await ctx.db.get(args.blogId);
        if (!blog) return;

        // Prevent author from inflating their own view count
        const userId = await getAuthUserId(ctx);
        if (userId === blog.userId) return;

        await ctx.db.insert("pageViews", {
            blogId: args.blogId,
            timestamp: Date.now(),
        });

        await ctx.db.patch(args.blogId, {
            viewCount: blog.viewCount + 1,
        });
    },
});

// ─── Analytics Queries ───────────────────────────────────────────

export const getPageViews = query({
    args: {
        blogId: v.optional(v.id("blogs")),
        since: v.optional(v.float64()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        if (args.blogId) {
            const views = await ctx.db
                .query("pageViews")
                .withIndex("by_blog", (q) => q.eq("blogId", args.blogId!))
                .collect();
            return args.since
                ? views.filter((v) => v.timestamp >= args.since!)
                : views;
        }

        // All page views for user's blogs — use index per blog
        const userBlogs = await ctx.db
            .query("blogs")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const viewGroups = await Promise.all(
            userBlogs.map((blog) =>
                ctx.db
                    .query("pageViews")
                    .withIndex("by_blog", (q) => q.eq("blogId", blog._id))
                    .collect()
            )
        );

        const allViews = viewGroups.flat();
        return args.since
            ? allViews.filter((v) => v.timestamp >= args.since!)
            : allViews;
    },
});
