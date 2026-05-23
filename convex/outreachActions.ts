import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// ─── Brevo Email Sending Action ──────────────────────────────────
// Uses fetch() in the default Convex runtime (no "use node" needed).
// Actions cannot access ctx.db — all DB operations go through runQuery/runMutation.

export const sendEmailToLead = internalAction({
    args: {
        campaignId: v.id("campaigns"),
        leadId: v.id("leads"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // Step 1: Fetch campaign, template, and lead data
        const campaign = await ctx.runQuery(
            internal.campaigns.getCampaignInternal,
            { campaignId: args.campaignId }
        );
        // PAUSE GUARD: If campaign was paused/deleted after this action was scheduled, abort.
        if (!campaign) return;
        if (campaign.status === "paused" || campaign.status === "completed") return;

        // DEDUP GUARD: Skip if this lead was already emailed in this campaign
        const alreadySent = await ctx.runQuery(
            internal.outreachCron.hasAlreadySentToLead,
            { campaignId: args.campaignId, leadId: args.leadId }
        );
        if (alreadySent) return;

        const template = await ctx.runQuery(
            internal.emailTemplates.getTemplateInternal,
            { templateId: campaign.templateId }
        );
        if (!template) return;

        const lead = await ctx.runQuery(
            internal.leads.getLeadInternal,
            { leadId: args.leadId }
        );
        if (!lead) return;

        // Step 2: Replace template variables
        const replacements: Record<string, string> = {
            "{{companyName}}": lead.companyName ?? "",
            "{{decisionMakerName}}": lead.decisionMakerName ?? "",
            "{{title}}": lead.title ?? "",
            "{{website}}": lead.website ?? "",
            "{{location}}": lead.location ?? "",
            "{{category}}": lead.category ?? "",
            "{{email}}": lead.email,
        };

        let body = template.body;
        let subject = template.subject;
        for (const [placeholder, value] of Object.entries(replacements)) {
            const regex = new RegExp(
                placeholder.replace(/[{}]/g, "\\$&"),
                "g"
            );
            body = body.replace(regex, value);
            subject = subject.replace(regex, value);
        }

        // Inject custom field variables (e.g. {{Industry}}, {{LinkedIn}})
        if (lead.customFields) {
            for (const [key, value] of Object.entries(lead.customFields)) {
                const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
                body = body.replace(regex, value);
                subject = subject.replace(regex, value);
            }
        }

        // Step 3: If plain text template, convert newlines to <br/> for HTML rendering
        const isPlainText = template.bodyMode === "text";
        if (isPlainText) {
            // Escape HTML entities first so plain text is safe, then convert newlines
            body = body
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\n/g, "<br/>");
        }

        // Step 4: Send via Brevo API
        const brevoApiKey = process.env.BREVO_API_KEY;
        if (!brevoApiKey) {
            await ctx.runMutation(internal.outreachCron.logEmailResult, {
                campaignId: args.campaignId,
                leadId: args.leadId,
                userId: args.userId,
                brevoMessageId: undefined,
                success: false,
                errorMessage: "BREVO_API_KEY environment variable not set",
            });
            return;
        }

        try {
            const response = await fetch(
                "https://api.brevo.com/v3/smtp/email",
                {
                    method: "POST",
                    headers: {
                        "api-key": brevoApiKey,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        sender: {
                            name: campaign.senderName,
                            email: campaign.senderEmail,
                        },
                        ...(campaign.replyToEmail
                            ? { replyTo: { email: campaign.replyToEmail } }
                            : {}),
                        to: [
                            {
                                email: lead.email,
                                name: lead.decisionMakerName ?? undefined,
                            },
                        ],
                        subject,
                        htmlContent: body,
                        tags: [args.campaignId],
                    }),
                }
            );

            if (!response.ok) {
                const errorBody = await response.text();
                await ctx.runMutation(internal.outreachCron.logEmailResult, {
                    campaignId: args.campaignId,
                    leadId: args.leadId,
                    userId: args.userId,
                    brevoMessageId: undefined,
                    success: false,
                    errorMessage: `Brevo API ${response.status}: ${errorBody}`,
                });
                return;
            }

            const data = await response.json();
            const messageId =
                data.messageId ?? data["message-id"] ?? undefined;

            await ctx.runMutation(internal.outreachCron.logEmailResult, {
                campaignId: args.campaignId,
                leadId: args.leadId,
                userId: args.userId,
                brevoMessageId: messageId,
                success: true,
                errorMessage: undefined,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unknown error sending email";
            await ctx.runMutation(internal.outreachCron.logEmailResult, {
                campaignId: args.campaignId,
                leadId: args.leadId,
                userId: args.userId,
                brevoMessageId: undefined,
                success: false,
                errorMessage: message,
            });
        }
    },
});
