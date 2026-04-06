import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Mount Convex Auth HTTP routes
auth.addHttpRoutes(http);

// ─── Public Blog API ─────────────────────────────────────────────

// GET /api/blog/all — Retrieve all published blogs for a user (requires API key)
http.route({
    path: "/api/blog/all",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
        const apiKey = request.headers.get("X-Api-Key");
        if (!apiKey) {
            return new Response(JSON.stringify({ error: "API key required" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const articles = await ctx.runQuery(api.queries.getPublishedArticles);
        return new Response(JSON.stringify(articles), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
    }),
});

// GET /api/blog/slugs — Retrieve all published article slugs
http.route({
    path: "/api/blog/slugs",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
        const apiKey = request.headers.get("X-Api-Key");
        if (!apiKey) {
            return new Response(JSON.stringify({ error: "API key required" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const slugs = await ctx.runQuery(api.queries.getArticleSlugs);
        return new Response(JSON.stringify(slugs), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
    }),
});

// GET /api/blog/:slug — Retrieve a single article by slug
http.route({
    path: "/api/blog/article",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
        const apiKey = request.headers.get("X-Api-Key");
        if (!apiKey) {
            return new Response(JSON.stringify({ error: "API key required" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const url = new URL(request.url);
        const slug = url.searchParams.get("slug");
        if (!slug) {
            return new Response(JSON.stringify({ error: "slug parameter required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const article = await ctx.runQuery(api.queries.readPublicArticle, { slug });
        if (!article) {
            return new Response(JSON.stringify({ error: "Article not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify(article), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
    }),
});

// CORS preflight handler
http.route({
    path: "/api/blog/all",
    method: "OPTIONS",
    handler: httpAction(async () => {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, X-Api-Key",
            },
        });
    }),
});

http.route({
    path: "/api/blog/slugs",
    method: "OPTIONS",
    handler: httpAction(async () => {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, X-Api-Key",
            },
        });
    }),
});

http.route({
    path: "/api/blog/article",
    method: "OPTIONS",
    handler: httpAction(async () => {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, X-Api-Key",
            },
        });
    }),
});

export default http;
