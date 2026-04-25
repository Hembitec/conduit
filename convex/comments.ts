import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Comment Mutations ───────────────────────────────────────────

export const createComment = mutation({
    args: {
        blogId: v.id("blogs"),
        authorName: v.string(),
        authorEmail: v.string(),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const blog = await ctx.db.get(args.blogId);
        if (!blog || !blog.published) throw new Error("Article not found");

        return await ctx.db.insert("comments", {
            blogId: args.blogId,
            authorName: args.authorName,
            authorEmail: args.authorEmail,
            content: args.content,
            approved: false,
        });
    },
});

export const approveComment = mutation({
    args: { id: v.id("comments"), approved: v.boolean() },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const comment = await ctx.db.get(args.id);
        if (!comment) throw new Error("Comment not found");

        const blog = await ctx.db.get(comment.blogId);
        if (!blog || blog.userId !== userId) throw new Error("Forbidden");

        await ctx.db.patch(args.id, { approved: args.approved });
    },
});

export const deleteComment = mutation({
    args: { id: v.id("comments") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const comment = await ctx.db.get(args.id);
        if (!comment) throw new Error("Comment not found");

        const blog = await ctx.db.get(comment.blogId);
        if (!blog || blog.userId !== userId) throw new Error("Forbidden");

        await ctx.db.delete(args.id);
    },
});

// ─── Comment Queries ─────────────────────────────────────────────

export const getCommentsByBlog = query({
    args: { blogId: v.id("blogs") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("comments")
            .withIndex("by_blog", (q) => q.eq("blogId", args.blogId))
            .order("desc")
            .collect();
    },
});

export const getAllComments = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        // Get user's blogs (indexed)
        const userBlogs = await ctx.db
            .query("blogs")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        // Query comments per blog (using index each time — no full table scan)
        const commentGroups = await Promise.all(
            userBlogs.map(async (blog) => {
                const comments = await ctx.db
                    .query("comments")
                    .withIndex("by_blog", (q) => q.eq("blogId", blog._id))
                    .order("desc")
                    .collect();
                return comments.map((comment) => ({
                    ...comment,
                    blogTitle: blog.title,
                }));
            })
        );

        return commentGroups.flat();
    },
});
