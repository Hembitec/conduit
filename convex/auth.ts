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
            // @convex-dev/auth's createOrUpdateUser callback provides an untyped ctx.
            // These casts are necessary until the library adds proper generics.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const db = ctx.db as any;
            const existingProfile = await db
                .query("userProfiles")
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .withIndex("by_user", (q: any) => q.eq("userId", userId))
                .unique();
            if (!existingProfile) {
                await db.insert("userProfiles", { userId });
            }

            return userId;
        },
    },
});
