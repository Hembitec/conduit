/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics from "../analytics.js";
import type * as auth from "../auth.js";
import type * as authors from "../authors.js";
import type * as blogs from "../blogs.js";
import type * as campaigns from "../campaigns.js";
import type * as categories from "../categories.js";
import type * as comments from "../comments.js";
import type * as crons from "../crons.js";
import type * as dashboard from "../dashboard.js";
import type * as documents from "../documents.js";
import type * as emailTemplates from "../emailTemplates.js";
import type * as feedback from "../feedback.js";
import type * as http from "../http.js";
import type * as leadFolders from "../leadFolders.js";
import type * as leads from "../leads.js";
import type * as outreachActions from "../outreachActions.js";
import type * as outreachAnalytics from "../outreachAnalytics.js";
import type * as outreachCron from "../outreachCron.js";
import type * as subscribers from "../subscribers.js";
import type * as surveys from "../surveys.js";
import type * as tags from "../tags.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  auth: typeof auth;
  authors: typeof authors;
  blogs: typeof blogs;
  campaigns: typeof campaigns;
  categories: typeof categories;
  comments: typeof comments;
  crons: typeof crons;
  dashboard: typeof dashboard;
  documents: typeof documents;
  emailTemplates: typeof emailTemplates;
  feedback: typeof feedback;
  http: typeof http;
  leadFolders: typeof leadFolders;
  leads: typeof leads;
  outreachActions: typeof outreachActions;
  outreachAnalytics: typeof outreachAnalytics;
  outreachCron: typeof outreachCron;
  subscribers: typeof subscribers;
  surveys: typeof surveys;
  tags: typeof tags;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
