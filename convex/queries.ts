import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

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

// ─── Blog / Article Queries ──────────────────────────────────────

export const getAllArticles = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];
        const blogs = await ctx.db
            .query("blogs")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();

        // Enrich with author and category names
        return await Promise.all(
            blogs.map(async (blog) => {
                const author = blog.authorId
                    ? await ctx.db.get(blog.authorId)
                    : null;
                const category = blog.categoryId
                    ? await ctx.db.get(blog.categoryId)
                    : null;
                return {
                    ...blog,
                    author: author ? { name: author.name, profileImg: author.profileImg } : null,
                    category: category ? { name: category.name } : null,
                };
            })
        );
    },
});

export const getArticleBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;
        const blog = await ctx.db
            .query("blogs")
            .withIndex("by_user_and_slug", (q) =>
                q.eq("userId", userId).eq("slug", args.slug)
            )
            .unique();
        if (!blog) return null;

        const author = blog.authorId ? await ctx.db.get(blog.authorId) : null;
        const category = blog.categoryId ? await ctx.db.get(blog.categoryId) : null;

        return {
            ...blog,
            author: author ?? null,
            category: category ?? null,
        };
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

// ─── Public Queries (no auth required) ───────────────────────────

export const readPublicArticle = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const blog = await ctx.db
            .query("blogs")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();

        if (!blog || !blog.published) return null;

        const author = blog.authorId ? await ctx.db.get(blog.authorId) : null;
        const category = blog.categoryId
            ? await ctx.db.get(blog.categoryId)
            : null;

        return {
            ...blog,
            author: author ?? null,
            category: category ?? null,
        };
    },
});

export const getPublishedArticles = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("blogs")
            .withIndex("by_published", (q) => q.eq("published", true))
            .order("desc")
            .collect();
    },
});

export const getArticleSlugs = query({
    args: {},
    handler: async (ctx) => {
        const blogs = await ctx.db
            .query("blogs")
            .withIndex("by_published", (q) => q.eq("published", true))
            .collect();
        return blogs.map((b) => ({ slug: b.slug }));
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

        // Get all blogs belonging to this user
        const userBlogs = await ctx.db
            .query("blogs")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();
        const blogIds = new Set(userBlogs.map((b) => b._id));

        // Get all comments for user's blogs
        const allComments = await ctx.db.query("comments").order("desc").collect();
        const userComments = allComments.filter((c) => blogIds.has(c.blogId));

        return await Promise.all(
            userComments.map(async (comment) => {
                const blog = await ctx.db.get(comment.blogId);
                return {
                    ...comment,
                    blogTitle: blog?.title ?? "Unknown",
                };
            })
        );
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
            if (args.since) {
                return views.filter((v) => v.timestamp >= args.since!);
            }
            return views;
        }

        // All page views for user's blogs
        const userBlogs = await ctx.db
            .query("blogs")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();
        const blogIds = new Set(userBlogs.map((b) => b._id));
        const allViews = await ctx.db.query("pageViews").collect();
        const filtered = allViews.filter((v) => blogIds.has(v.blogId));
        if (args.since) {
            return filtered.filter((v) => v.timestamp >= args.since!);
        }
        return filtered;
    },
});

// ─── User Queries ────────────────────────────────────────────────

export const currentUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;
        return await ctx.db.get(userId);
    },
});
