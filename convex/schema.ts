import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  // Auth tables managed by @convex-dev/auth (includes users, sessions, accounts etc.)
  ...authTables,

  // Extended user profile (separate from the auth users table)
  userProfiles: defineTable({
    userId: v.id("users"),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    apiKey: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_api_key", ["apiKey"]),

  // Draft documents (editor workspace)
  documents: defineTable({
    title: v.string(),
    document: v.string(), // TipTap HTML content
    userId: v.id("users"),
  }).index("by_user", ["userId"]),

  // Blog categories
  categories: defineTable({
    name: v.string(),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),

  // Blog authors
  authors: defineTable({
    name: v.string(),
    profileImg: v.optional(v.string()),
    instagram: v.optional(v.string()),
    twitter: v.optional(v.string()),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),

  // Published blog articles
  blogs: defineTable({
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
    published: v.boolean(),
    shareable: v.boolean(),
    viewCount: v.float64(),
    readingTime: v.optional(v.float64()),
    tagIds: v.optional(v.array(v.id("tags"))),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .index("by_slug", ["slug"])
    .index("by_user_and_slug", ["userId", "slug"])
    .index("by_published", ["published"]),

  // Comments on published articles
  comments: defineTable({
    blogId: v.id("blogs"),
    authorName: v.string(),
    authorEmail: v.string(),
    content: v.string(),
    approved: v.boolean(),
  })
    .index("by_blog", ["blogId"])
    .index("by_blog_and_approved", ["blogId", "approved"]),

  // Page view tracking
  pageViews: defineTable({
    blogId: v.id("blogs"),
    timestamp: v.float64(),
  }).index("by_blog", ["blogId"]),

  // Newsletter Subscribers
  subscribers: defineTable({
    email: v.string(),
    blogUserId: v.id("users"), // the owner of the blog
  }).index("by_user", ["blogUserId"]),

  // Blog Tags
  tags: defineTable({
    name: v.string(),
    slug: v.string(),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),

  // ── Outreach: Leads ──
  leads: defineTable({
    companyName: v.optional(v.string()),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
    phone: v.optional(v.string()),
    decisionMakerName: v.optional(v.string()),
    title: v.optional(v.string()),
    email: v.string(),
    category: v.optional(v.string()),
    status: v.string(), // "new" | "contacted" | "replied" | "bounced" | "unsubscribed"
    userId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_user_and_email", ["userId", "email"])
    .index("by_user_and_category", ["userId", "category"]),

  // ── Outreach: Email Templates ──
  emailTemplates: defineTable({
    name: v.string(),
    subject: v.string(),
    body: v.string(),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),

  // ── Outreach: Campaigns ──
  campaigns: defineTable({
    name: v.string(),
    templateId: v.id("emailTemplates"),
    senderName: v.string(),
    senderEmail: v.string(),
    targetLeadStatus: v.string(),
    status: v.string(), // "draft" | "running" | "paused" | "completed"
    rateLimitPerHour: v.number(),
    totalLeads: v.number(),
    sentCount: v.number(),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  // ── Outreach: Email Logs ──
  emailLogs: defineTable({
    campaignId: v.id("campaigns"),
    leadId: v.id("leads"),
    brevoMessageId: v.optional(v.string()),
    status: v.string(), // "queued" | "sent" | "delivered" | "opened" | "clicked" | "bounced"
    sentAt: v.optional(v.float64()),
    openedAt: v.optional(v.float64()),
    clickedAt: v.optional(v.float64()),
    errorMessage: v.optional(v.string()),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .index("by_campaign", ["campaignId"])
    .index("by_brevoMessageId", ["brevoMessageId"]),
});
