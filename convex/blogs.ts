import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Blog / Article Mutations ────────────────────────────────────

export const storeArticle = mutation({
    args: {
        title: v.string(),
        subtitle: v.optional(v.string()),
        slug: v.string(),
        blogHtml: v.string(),
        sourceDocumentId: v.optional(v.id("documents")),
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

        // Reject duplicate slugs for this user
        const existing = await ctx.db
            .query("blogs")
            .withIndex("by_user_and_slug", (q) =>
                q.eq("userId", userId).eq("slug", args.slug)
            )
            .unique();
        if (existing) throw new ConvexError("An article with this slug already exists");

        // Calculate reading time (words / 200 wpm)
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
        title: v.optional(v.string()),
        subtitle: v.optional(v.string()),
        blogHtml: v.optional(v.string()),
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

        const blog = await ctx.db
            .query("blogs")
            .withIndex("by_user_and_slug", (q) =>
                q.eq("userId", userId).eq("slug", args.slug)
            )
            .unique();
        if (!blog) throw new Error("Article not found");

        const { slug, blogHtml, ...rest } = args;

        // Recalculate reading time if blogHtml was updated
        const readingTime = blogHtml
            ? Math.ceil(
                blogHtml.replace(/<[^>]*>/g, "").split(/\s+/).length / 200
            )
            : blog.readingTime;

        await ctx.db.patch(blog._id, {
            ...rest,
            ...(blogHtml ? { blogHtml } : {}),
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

// Internal: returns ALL published articles (for future public blog page)
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

// API: returns published articles for a specific user (SaaS-scoped)
export const getPublishedArticlesByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const blogs = await ctx.db
            .query("blogs")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();

        const published = blogs.filter((b) => b.published);
        return await Promise.all(
            published.map(async (blog) => {
                const author = blog.authorId ? await ctx.db.get(blog.authorId) : null;
                const category = blog.categoryId ? await ctx.db.get(blog.categoryId) : null;
                return {
                    ...blog,
                    author: author ? { name: author.name, profileImg: author.profileImg } : null,
                    category: category ? { name: category.name } : null,
                };
            })
        );
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

// API: returns slugs for a specific user (SaaS-scoped)
export const getArticleSlugsByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const blogs = await ctx.db
            .query("blogs")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();
        return blogs.filter((b) => b.published).map((b) => ({ slug: b.slug }));
    },
});
