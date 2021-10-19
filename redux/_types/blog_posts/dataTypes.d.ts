export type BlogPostData = {
  _id: string;
  title: string;
  author: {
    authorId: string;
    name: string;
  }
  content: string;
  category: "informational" | "beginner" | "intermediate" | "advanced" | "";
  likes: string[];
  numOflikes: number;
  slug: string;
  keywords: string[];
  published: boolean;
  editedAt: string;
  createdAt: string;
};
export type BlogPostFormData = {
  _id?: string;
  title?: string;
  author?: {
    authorId?: string;
    name?: string;
  };
  content?: string;
  category?: "informational" | "beginner" | "intermediate" | "advanced" | string;
  slug?: string;
  keywords?: string[];
  published?: boolean;
  editedAt?: string;
  createdAt?: string;
};
export interface IBlogPostState {
  status: number;
  responseMsg: string;
  loading: boolean;
  blogPosts: BlogPostData[];
  currentBlogPost: BlogPostData;
  error: any;
  errorMessages: string[] | null;
}
export type SearchCategories = "all" | "informational" | "beginner" | "intermediate" | "advanced";

export type IndexBlogPostRes = {
  responseMsg: string;
  blogPosts: BlogPostData[];
  error?: any;
  errorMessages?: string[];
}
export type OneBlogPostRes = {
  responseMsg: string;
  blogPost: BlogPostData;
  error?: any;
  errorMessages?: string[];
};
export type CreateBlogPostRes = {
  responseMsg: string;
  createdBlogPost: BlogPostData;
  error?: any;
  errorMessages?: string[];
};
export type EditBlogPostRes = {
  responseMsg: string;
  editedBlogPost: BlogPostData;
  error?: any;
  errorMessages: string[];
};
export type DeleteBlogPostRes = {
  responseMsg: string;
  deletedBlogPost: BlogPostData;
  error?: any;
  errorMessages?: string[];
};
export type ErrorBlogPostRes = {
  responseMsg: string;
  error: any;
  errorMessages: string[];
};
export type FetchBlogPostsOpts = {
  category?: "all" | "informational" | "beginner" | "intermediate" | "advanced";
  createdAt?: "desc" | "asc";
  limit?: number;
  baseUrl?: string;
}
