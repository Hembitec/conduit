import { Id } from "@/convex/_generated/dataModel";

/**
 * Shared TypeScript types for Conduit CMS
 * Centralizes all data interfaces to avoid duplication and `any` types
 */

// ============================================================================
// User & Auth Types
// ============================================================================

export interface User {
  _id: Id<"users">;
  email: string;
  apiKey?: string;
  name?: string;
}

// ============================================================================
// Content Types
// ============================================================================

export interface Document {
  _id: Id<"documents">;
  title: string;
  document: string;
  userId: Id<"users">;
  _creationTime: number;
}

export interface Category {
  _id: Id<"categories">;
  name: string;
  userId: Id<"users">;
  _creationTime: number;
}

export interface Author {
  _id: Id<"authors">;
  name: string;
  instagram?: string;
  twitter?: string;
  profileImg?: string;
  userId: Id<"users">;
  _creationTime: number;
}

// ============================================================================
// Article Types
// ============================================================================

export interface Article {
  _id: Id<"blogs">;
  title: string;
  subtitle?: string;
  slug: string;
  blogHtml: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  published: boolean;
  shareable: boolean;
  viewCount: number;
  readingTime?: number;
  authorId?: Id<"authors">;
  categoryId?: Id<"categories">;
  userId: Id<"users">;
  _creationTime: number;
  // Populated fields from queries
  author?: Author;
  category?: Category;
}

export interface PublicArticle {
  _id: Id<"blogs">;
  title: string;
  subtitle?: string;
  slug: string;
  blogHtml: string;
  image?: string;
  imageAlt?: string;
  metaDescription?: string;
  keywords?: string[];
  published: boolean;
  shareable: boolean;
  viewCount: number;
  readingTime?: number;
  userId: Id<"users">;
  tagIds?: Id<"tags">[];
  tags?: Array<{ _id: Id<"tags">; name: string; slug: string }>;
  author?: PublicAuthor;
  category?: PublicCategory;
  _creationTime: number;
}

/** Shape returned by getPublishedArticles — enriched with author/category */
export interface ListedArticle {
  _id: Id<"blogs">;
  title: string;
  subtitle?: string;
  slug: string;
  image?: string;
  imageAlt?: string;
  published: boolean;
  shareable: boolean;
  viewCount: number;
  readingTime?: number;
  userId: Id<"users">;
  _creationTime: number;
  author: { name: string; profileImg?: string } | null;
  category: { name: string } | null;
}

export interface PublicAuthor {
  name: string;
  profileImg?: string;
  instagram?: string;
  twitter?: string;
}

export interface PublicCategory {
  name: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// ============================================================================
// Form Data Types
// ============================================================================

export interface PublishFormData {
  title: string;
  subtitle: string;
  slug: string;
  keywords: string;
  image_alt: string;
  author: string;
  category: string;
  article: string;
}

export interface AuthorFormData {
  name: string;
  instagram: string;
  twitter: string;
}

// ============================================================================
// Navigation Types
// ============================================================================

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  label: string;
  href: string;
  icon: string; // Lucide icon name
  badge?: number;
}

// ============================================================================
// UI Component Types
// ============================================================================

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  icon?: string; // Lucide icon name - defaults to FileText
}

export interface ArticleCardProps {
  article: Article;
  onShare?: (slug: string) => void;
  onDelete?: (id: Id<"blogs">) => void;
}

export interface DocumentCardProps {
  document: Document;
  onDelete?: (id: Id<"documents">) => void;
}

// ============================================================================
// Outreach Types
// ============================================================================

export interface Lead {
  _id: Id<"leads">;
  companyName?: string;
  location?: string;
  website?: string;
  phone?: string;
  decisionMakerName?: string;
  title?: string;
  email: string;
  category?: string;
  customFields?: Record<string, string>;
  folderId?: Id<"leadFolders">;
  status: string;
  userId: Id<"users">;
  _creationTime: number;
}

export interface EmailTemplate {
  _id: Id<"emailTemplates">;
  name: string;
  subject: string;
  body: string;
  userId: Id<"users">;
  _creationTime: number;
}

export interface Campaign {
  _id: Id<"campaigns">;
  name: string;
  templateId: Id<"emailTemplates">;
  senderName: string;
  senderEmail: string;
  targetLeadStatus: string;
  status: string;
  rateLimitPerHour: number;
  totalLeads: number;
  sentCount: number;
  userId: Id<"users">;
  _creationTime: number;
}

export interface EmailLog {
  _id: Id<"emailLogs">;
  campaignId: Id<"campaigns">;
  leadId: Id<"leads">;
  brevoMessageId?: string;
  status: string;
  sentAt?: number;
  openedAt?: number;
  clickedAt?: number;
  errorMessage?: string;
  userId: Id<"users">;
  _creationTime: number;
}

// ============================================================================
// Feedback Types
// ============================================================================

export type FeedbackType = "bug" | "feature" | "general";
export type FeedbackStatus = "new" | "in_progress" | "resolved" | "dismissed";

export interface Feedback {
  _id: Id<"feedback">;
  authorName: string;
  authorEmail?: string;
  type: FeedbackType;
  message: string;
  pageUrl?: string;
  screenshots?: string[];
  status: FeedbackStatus;
  userId: Id<"users">;
  _creationTime: number;
}

// ============================================================================
// Survey Types
// ============================================================================

export type QuestionType =
  | "nps"
  | "open_ended"
  | "multiple_choice"
  | "rating"
  | "text_feedback";

export type SurveyStatus = "draft" | "active" | "closed";

export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
  ratingScale?: number;
  ratingLabels?: { low: string; high: string };
}

export interface SurveySettings {
  allowAnonymous: boolean;
  requireEmail: boolean;
  showProgress: boolean;
}

export interface Survey {
  _id: Id<"surveys">;
  title: string;
  description?: string;
  slug: string;
  status: SurveyStatus;
  questions: SurveyQuestion[];
  settings: SurveySettings;
  responseCount: number;
  userId: Id<"users">;
  _creationTime: number;
}

export interface SurveyAnswer {
  questionId: string;
  type: string;
  value: string | number;
}

export interface SurveyResponse {
  _id: Id<"surveyResponses">;
  surveyId: Id<"surveys">;
  respondentName?: string;
  respondentEmail?: string;
  answers: SurveyAnswer[];
  pageUrl?: string;
  completedAt: number;
  userId: Id<"users">;
  _creationTime: number;
}

