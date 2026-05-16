import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

// Mount Convex Auth HTTP routes (handles /api/auth/* endpoints)
auth.addHttpRoutes(http);

// ─── Brevo Webhook Health Check ──────────────────────────────────
// GET /api/webhooks/brevo — returns 200 so you can verify the URL is reachable
http.route({
    path: "/api/webhooks/brevo",
    method: "GET",
    handler: httpAction(async () => {
        return new Response(
            JSON.stringify({
                status: "ok",
                message: "Brevo webhook endpoint is active",
                timestamp: new Date().toISOString(),
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    }),
});

// ─── Brevo Webhook — Email Tracking Events ───────────────────────
// POST /api/webhooks/brevo — receives open, click, bounce events from Brevo
//
// Brevo sends events with these structures:
//   { "event": "opened", "message-id": "<xxx@smtp-relay.mailin.fr>", "ts_event": 1234567890 }
//   { "event": "click", "message-id": "<xxx@smtp-relay.mailin.fr>", "ts_event": 1234567890 }
//   { "event": "hardBounce", "message-id": "<xxx@smtp-relay.mailin.fr>", "ts_event": 1234567890 }
//
// The message-id from Brevo's webhook payload includes angle brackets:
//   "<202605141140.46951309372@smtp-relay.mailin.fr>"
// This must match what we stored from the send response.

http.route({
    path: "/api/webhooks/brevo",
    method: "POST",
    handler: httpAction(async (ctx, req) => {
        let body: Record<string, unknown>;
        try {
            body = await req.json();
        } catch {
            return new Response("Invalid JSON body", { status: 400 });
        }

        // Brevo uses "message-id" (with hyphen) in webhook payloads
        const messageId = body["message-id"] ?? body.messageId;
        const event = body.event;
        const tsEvent = body.ts_event;

        if (!messageId || !event) {
            return new Response(
                JSON.stringify({
                    error: "Missing required fields",
                    received: { messageId: !!messageId, event: !!event },
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
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
