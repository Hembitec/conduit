import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Question Validator (reused across mutations) ─────────────────

const questionValidator = v.object({
  id: v.string(),
  type: v.union(
    v.literal("nps"),
    v.literal("open_ended"),
    v.literal("multiple_choice"),
    v.literal("rating"),
    v.literal("text_feedback")
  ),
  title: v.string(),
  description: v.optional(v.string()),
  required: v.boolean(),
  options: v.optional(v.array(v.string())),
  ratingScale: v.optional(v.number()),
  ratingLabels: v.optional(
    v.object({ low: v.string(), high: v.string() })
  ),
});

const settingsValidator = v.object({
  allowAnonymous: v.boolean(),
  requireEmail: v.boolean(),
  showProgress: v.boolean(),
});

const answerValidator = v.object({
  questionId: v.string(),
  type: v.string(),
  value: v.union(v.string(), v.number()),
});

// ─── Survey CRUD (CMS owner — session auth) ──────────────────────

export const createSurvey = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    slug: v.string(),
    questions: v.array(questionValidator),
    settings: settingsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthorized");

    if (!args.title.trim()) throw new ConvexError("Title is required");
    if (!args.slug.trim()) throw new ConvexError("Slug is required");
    if (!/^[a-z0-9-]+$/.test(args.slug)) {
      throw new ConvexError("Slug must be lowercase alphanumeric with hyphens");
    }

    // Check slug uniqueness for this user
    const existing = await ctx.db
      .query("surveys")
      .withIndex("by_user_and_slug", (q) =>
        q.eq("userId", userId).eq("slug", args.slug)
      )
      .first();
    if (existing) throw new ConvexError("A survey with this slug already exists");

    return await ctx.db.insert("surveys", {
      title: args.title.trim(),
      description: args.description?.trim(),
      slug: args.slug.trim(),
      status: "draft",
      questions: args.questions,
      settings: args.settings,
      responseCount: 0,
      userId,
    });
  },
});

export const updateSurvey = mutation({
  args: {
    id: v.id("surveys"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    questions: v.optional(v.array(questionValidator)),
    settings: v.optional(settingsValidator),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthorized");

    const survey = await ctx.db.get(args.id);
    if (!survey || survey.userId !== userId) throw new ConvexError("Forbidden");

    const patch: Record<string, unknown> = {};
    if (args.title !== undefined) patch.title = args.title.trim();
    if (args.description !== undefined) patch.description = args.description.trim();
    if (args.questions !== undefined) patch.questions = args.questions;
    if (args.settings !== undefined) patch.settings = args.settings;

    await ctx.db.patch(args.id, patch);
  },
});

export const updateSurveyStatus = mutation({
  args: {
    id: v.id("surveys"),
    status: v.union(
      v.literal("draft"),
      v.literal("active"),
      v.literal("closed")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthorized");

    const survey = await ctx.db.get(args.id);
    if (!survey || survey.userId !== userId) throw new ConvexError("Forbidden");

    if (args.status === "active" && survey.questions.length === 0) {
      throw new ConvexError("Cannot activate a survey with no questions");
    }

    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const deleteSurvey = mutation({
  args: { id: v.id("surveys") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthorized");

    const survey = await ctx.db.get(args.id);
    if (!survey || survey.userId !== userId) throw new ConvexError("Forbidden");

    // Delete all responses for this survey
    const responses = await ctx.db
      .query("surveyResponses")
      .withIndex("by_survey", (q) => q.eq("surveyId", args.id))
      .take(500);
    for (const r of responses) {
      await ctx.db.delete(r._id);
    }

    await ctx.db.delete(args.id);
  },
});

// ─── Survey Queries (CMS dashboard) ──────────────────────────────

export const getAllSurveys = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("surveys")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(100);
  },
});

export const getSurvey = query({
  args: { id: v.id("surveys") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const survey = await ctx.db.get(args.id);
    if (!survey || survey.userId !== userId) return null;

    return survey;
  },
});

export const getSurveyResponses = query({
  args: { surveyId: v.id("surveys") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const survey = await ctx.db.get(args.surveyId);
    if (!survey || survey.userId !== userId) return [];

    return await ctx.db
      .query("surveyResponses")
      .withIndex("by_survey", (q) => q.eq("surveyId", args.surveyId))
      .order("desc")
      .take(500);
  },
});

// ─── Public Mutation (called via API route) ──────────────────────

export const submitSurveyResponse = mutation({
  args: {
    surveyId: v.id("surveys"),
    respondentName: v.optional(v.string()),
    respondentEmail: v.optional(v.string()),
    answers: v.array(answerValidator),
    pageUrl: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const survey = await ctx.db.get(args.surveyId);
    if (!survey) throw new ConvexError("Survey not found");
    if (survey.status !== "active") {
      throw new ConvexError("This survey is not currently accepting responses");
    }
    if (survey.userId !== args.userId) {
      throw new ConvexError("Survey does not belong to this account");
    }

    // Validate required questions
    const requiredIds = survey.questions
      .filter((q) => q.required)
      .map((q) => q.id);
    const answeredIds = new Set(args.answers.map((a) => a.questionId));
    const missing = requiredIds.filter((id) => !answeredIds.has(id));
    if (missing.length > 0) {
      throw new ConvexError(
        `Missing required answers for: ${missing.join(", ")}`
      );
    }

    // Validate answer types match question types
    const questionMap = new Map(
      survey.questions.map((q) => [q.id, q])
    );
    for (const answer of args.answers) {
      const question = questionMap.get(answer.questionId);
      if (!question) {
        throw new ConvexError(`Unknown question: ${answer.questionId}`);
      }
      if (answer.type !== question.type) {
        throw new ConvexError(
          `Answer type mismatch for question ${answer.questionId}`
        );
      }

      // NPS must be 0-10
      if (question.type === "nps") {
        const val = Number(answer.value);
        if (isNaN(val) || val < 0 || val > 10) {
          throw new ConvexError("NPS score must be between 0 and 10");
        }
      }

      // Rating must be within scale
      if (question.type === "rating") {
        const scale = question.ratingScale ?? 5;
        const val = Number(answer.value);
        if (isNaN(val) || val < 1 || val > scale) {
          throw new ConvexError(`Rating must be between 1 and ${scale}`);
        }
      }

      // Multiple choice must be one of the options
      if (question.type === "multiple_choice") {
        const opts = question.options ?? [];
        if (!opts.includes(String(answer.value))) {
          throw new ConvexError(
            `Invalid choice for question ${answer.questionId}`
          );
        }
      }
    }

    await ctx.db.insert("surveyResponses", {
      surveyId: args.surveyId,
      respondentName: args.respondentName?.trim(),
      respondentEmail: args.respondentEmail?.trim(),
      answers: args.answers,
      pageUrl: args.pageUrl?.trim(),
      completedAt: Date.now(),
      userId: args.userId,
    });

    // Increment response count
    await ctx.db.patch(args.surveyId, {
      responseCount: survey.responseCount + 1,
    });
  },
});

// ─── Public Query (called via API route — no auth) ───────────────

export const getSurveyBySlug = query({
  args: {
    userId: v.id("users"),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const survey = await ctx.db
      .query("surveys")
      .withIndex("by_user_and_slug", (q) =>
        q.eq("userId", args.userId).eq("slug", args.slug)
      )
      .first();

    if (!survey || survey.status !== "active") return null;

    // Return only the public-facing structure (no responses, no userId)
    return {
      _id: survey._id,
      title: survey.title,
      description: survey.description,
      slug: survey.slug,
      questions: survey.questions,
      settings: survey.settings,
    };
  },
});
