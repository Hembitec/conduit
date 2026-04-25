import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── User / Profile Mutations ────────────────────────────────────

export const generateApiKey = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        // Generate a cryptographically secure 32-byte hex key
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        const apiKey =
            "cms_" +
            Array.from(array)
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");

        // Store in userProfiles (not the auth users table)
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        if (profile) {
            await ctx.db.patch(profile._id, { apiKey });
        } else {
            await ctx.db.insert("userProfiles", { userId, apiKey });
        }

        return apiKey;
    },
});

// Create or update user profile on first sign-in
export const upsertUserProfile = mutation({
    args: {
        name: v.optional(v.string()),
        image: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const existing = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, args);
        } else {
            await ctx.db.insert("userProfiles", { userId, ...args });
        }
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
