import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

// Mount Convex Auth HTTP routes (handles /api/auth/* endpoints)
auth.addHttpRoutes(http);

// Brevo webhook — receives email tracking events (open, click, bounce)
http.route({
    path: "/api/webhooks/brevo",
    method: "POST",
    handler: httpAction(async (ctx, req) => {
        const body = await req.json();
        const messageId = body["message-id"] ?? body.messageId;
        const event = body.event;
        const tsEvent = body.ts_event;

        if (!messageId || !event) {
            return new Response("Missing required fields", { status: 400 });
        }

        await ctx.runMutation(internal.outreachCron.updateEmailLogFromWebhook, {
            brevoMessageId: String(messageId),
            event: String(event),
            timestamp: typeof tsEvent === "number" ? tsEvent * 1000 : Date.now(),
        });

        return new Response("OK", { status: 200 });
    }),
});

export default http;
