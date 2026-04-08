import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [Password],
    callbacks: {
        async createOrUpdateUser(ctx, args) {
            // Determine the userId — re-use existing or create new
            const userId = args.existingUserId
                ?? await ctx.db.insert("users", args.profile);

            // Ensure a userProfiles row always exists (idempotent backfill)
            // Cast to any because this callback receives a generic untyped ctx
            const db = ctx.db as any;
            const existingProfile = await db
                .query("userProfiles")
                .withIndex("by_user", (q: any) => q.eq("userId", userId))
                .unique();
            if (!existingProfile) {
                await db.insert("userProfiles", { userId });
            }

            return userId;
        },
    },
});
