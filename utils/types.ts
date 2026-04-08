import { Id } from "@/convex/_generated/dataModel";

export interface Article {
  _id: Id<"blogs">;
  _creationTime: number;
  title: string;
  subtitle?: string;
  slug: string;
  blogHtml: string;
  image?: string;
  imageAlt?: string;
  metaDescription?: string;
  categoryId?: Id<"categories">;
  authorId?: Id<"authors">;
  keywords?: string[];
  published: boolean;
  shareable: boolean;
  viewCount: number;
  readingTime?: number;
  userId: Id<"users">;
  author?: {
    _id: Id<"authors">;
    _creationTime: number;
    name: string;
    profileImg?: string;
    instagram?: string;
    twitter?: string;
    userId: Id<"users">;
  } | null;
  category?: {
    name: string;
  } | null;
}

export interface Author {
  _id: Id<"authors">;
  _creationTime: number;
  name: string;
  profileImg?: string;
  instagram?: string;
  twitter?: string;
  userId: Id<"users">;
}

export interface Category {
  _id: Id<"categories">;
  _creationTime: number;
  name: string;
  userId: Id<"users">;
}

export interface Document {
  _id: Id<"documents">;
  _creationTime: number;
  title: string;
  document: string;
  userId: Id<"users">;
}
