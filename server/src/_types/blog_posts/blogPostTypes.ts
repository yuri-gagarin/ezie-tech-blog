import type { IBlogPost } from "../../models/BlogPost";

export type BlogPostData = {
  _id: string;
  title: string;
  author: string;
  content: string;
  category: string;
  keywords: string[];
  slug: string;
  live: boolean;
  editedAt: Date | string;
  createdAt: Date | string;
};
export type BlogPostClientData = {
  _id?: string;
  title?: string;
  author?: string;
  content?: string;
  keywords?: string[];
  live?: boolean;
  editedAt?: string;
  createdAt?: string;
};

export type IndexBlogPostRes = {
  responseMsg: string;
  blogPosts: IBlogPost[];
  error?: any;
  errorMessages?: string[];
}
export type OneBlogPostRes = {
  responseMsg: string;
  blogPost: IBlogPost;
  error?: any;
  errorMessages?: string[];
};
export type CreateBlogPostRes = {
  responseMsg: string;
  createdBlogPost: IBlogPost;
  error?: any;
  errorMessages?: string[];
};
export type EditBlogPostRes = {
  responseMsg: string;
  editedBlogPost: IBlogPost;
  error?: any;
};
export type DeleteBlogPostRes = {
  responseMsg: string;
  deletedBlogPost: IBlogPost;
  error?: any;
  errorMessages?: string[];
};
export type FetchBlogPostsOpts = {
  category?: "all" | "informational" | "beginner" | "intermediate" | "advanced";
  createdAt?: "desc" | "asc";
  limit?: number;
}