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
                const author = blog.authorId ? await ctx.db.get(blog.authorId) : null;
                const category = blog.categoryId
                    ? await ctx.db.get(blog.categoryId)
                    : null;
                return {
                    ...blog,
                    author: author
                        ? { name: author.name, profileImg: author.profileImg }
                        : null,
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
        const category = blog.categoryId
            ? await ctx.db.get(blog.categoryId)
            : null;

        return { ...blog, author: author ?? null, category: category ?? null };
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

        // Allow access if: published (public) OR shareable (direct link)
        if (!blog || (!blog.published && !blog.shareable)) return null;

        const author = blog.authorId ? await ctx.db.get(blog.authorId) : null;
        const category = blog.categoryId
            ? await ctx.db.get(blog.categoryId)
            : null;

        return { ...blog, author: author ?? null, category: category ?? null };
    },
});

export const getUserByApiKey = query({
    args: { apiKey: v.string() },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_api_key", (q) => q.eq("apiKey", args.apiKey))
            .unique();
        return profile ?? null;
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

// FIX: Was doing a full table scan on comments — now uses the by_blog index
// for each of the user's blogs instead of loading all comments globally.
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

// ─── Analytics Queries ───────────────────────────────────────────

// FIX: Was doing a full pageViews scan when no blogId given — now always
// fetches per blog using the index, even for the "all blogs" case.
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

// ─── User / Profile Queries ──────────────────────────────────────

export const currentUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;
        const user = await ctx.db.get(userId);
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();
        return { ...user, ...profile };
    },
});
