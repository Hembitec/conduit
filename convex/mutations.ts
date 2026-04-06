import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Document Mutations ──────────────────────────────────────────

export const createDocument = mutation({
    args: { title: v.string() },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");
        return await ctx.db.insert("documents", {
            title: args.title,
            document: "",
            userId,
        });
    },
});

export const storeDocument = mutation({
    args: {
        id: v.id("documents"),
        title: v.string(),
        document: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");
        const doc = await ctx.db.get(args.id);
        if (!doc || doc.userId !== userId) throw new Error("Not found");
        await ctx.db.patch(args.id, {
            title: args.title,
            document: args.document,
        });
    },
});

export const deleteDocument = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");
        const doc = await ctx.db.get(args.id);
        if (!doc || doc.userId !== userId) throw new Error("Not found");
        await ctx.db.delete(args.id);
    },
});

// ─── Blog / Article Mutations ────────────────────────────────────

export const storeArticle = mutation({
    args: {
        title: v.string(),
        subtitle: v.optional(v.string()),
        slug: v.string(),
        blogHtml: v.string(),
        image: v.optional(v.string()),
        imageAlt: v.optional(v.string()),
        metaDescription: v.optional(v.string()),
        categoryId: v.optional(v.id("categories")),
        authorId: v.optional(v.id("authors")),
        keywords: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        // Calculate reading time (words / 200)
        const wordCount = args.blogHtml.replace(/<[^>]*>/g, "").split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);

        return await ctx.db.insert("blogs", {
            ...args,
            published: false,
            shareable: false,
            viewCount: 0,
            readingTime,
            userId,
        });
    },
});

export const updateArticle = mutation({
    args: {
        slug: v.string(),
        blogHtml: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const blog = await ctx.db
            .query("blogs")
            .withIndex("by_user_and_slug", (q) =>
                q.eq("userId", userId).eq("slug", args.slug)
            )
            .unique();
        if (!blog) throw new Error("Article not found");

        // Recalculate reading time
        const wordCount = args.blogHtml.replace(/<[^>]*>/g, "").split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);

        await ctx.db.patch(blog._id, {
            blogHtml: args.blogHtml,
            readingTime,
        });
    },
});

export const deleteBlog = mutation({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const blog = await ctx.db
            .query("blogs")
            .withIndex("by_user_and_slug", (q) =>
                q.eq("userId", userId).eq("slug", args.slug)
            )
            .unique();
        if (!blog) throw new Error("Article not found");
        await ctx.db.delete(blog._id);
    },
});

export const statusBlog = mutation({
    args: {
        slug: v.string(),
        published: v.boolean(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const blog = await ctx.db
            .query("blogs")
            .withIndex("by_user_and_slug", (q) =>
                q.eq("userId", userId).eq("slug", args.slug)
            )
            .unique();
        if (!blog) throw new Error("Article not found");
        await ctx.db.patch(blog._id, { published: args.published });
    },
});

export const shareArticle = mutation({
    args: {
        slug: v.string(),
        shareable: v.boolean(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const blog = await ctx.db
            .query("blogs")
            .withIndex("by_user_and_slug", (q) =>
                q.eq("userId", userId).eq("slug", args.slug)
            )
            .unique();
        if (!blog) throw new Error("Article not found");
        await ctx.db.patch(blog._id, { shareable: args.shareable });
    },
});

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
        if (!userId) throw new Error("Unauthorized");
        return await ctx.db.insert("authors", {
            ...args,
            userId,
        });
    },
});

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
            throw new Error("Category already exists");
        }

        return await ctx.db.insert("categories", {
            name: args.name,
            userId,
        });
    },
});

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
        await ctx.db.patch(args.id, { approved: args.approved });
    },
});

export const deleteComment = mutation({
    args: { id: v.id("comments") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");
        await ctx.db.delete(args.id);
    },
});

// ─── Analytics Mutations ─────────────────────────────────────────

export const trackPageView = mutation({
    args: { blogId: v.id("blogs") },
    handler: async (ctx, args) => {
        const blog = await ctx.db.get(args.blogId);
        if (!blog) return;

        // Insert page view record
        await ctx.db.insert("pageViews", {
            blogId: args.blogId,
            timestamp: Date.now(),
        });

        // Increment view count on the blog
        await ctx.db.patch(args.blogId, {
            viewCount: blog.viewCount + 1,
        });
    },
});

// ─── User Mutations ──────────────────────────────────────────────

export const generateApiKey = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        // Generate a random API key
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let apiKey = "cms_";
        for (let i = 0; i < 32; i++) {
            apiKey += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        await ctx.db.patch(userId, { apiKey });
        return apiKey;
    },
});
