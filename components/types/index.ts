// Base component types for the application

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  loading: boolean;
  error?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface ArticleCardData {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  category: string;
  published: boolean;
  viewCount?: number;
  createdAt: Date;
  slug: string;
}

export interface CommentData {
  id: string;
  name: string;
  email: string;
  content: string;
  articleId: string;
  approved: boolean;
  createdAt: Date;
}
