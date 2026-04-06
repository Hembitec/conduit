import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // User profiles (extends auth user with app-specific fields)
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()),
    apiKey: v.optional(v.string()),
  }).index("by_email", ["email"]),

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
  }).index("by_blog", ["blogId"]),

  // Page view tracking
  pageViews: defineTable({
    blogId: v.id("blogs"),
    timestamp: v.float64(),
  }).index("by_blog", ["blogId"]),
});
