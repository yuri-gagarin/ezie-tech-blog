import type { IBlogPost } from "../../models/BlogPost";

export type BlogPostData = {
  _id: string;
  title: string;
  author: {
    authorId: string;
    name: string;
  };
  content: string;
  category: string;
  keywords: string[];
  slug: string;
  published: boolean;
  editedAt: Date | string;
  createdAt: Date | string;
};
export type BlogPostClientData = {
  _id?: string;
  title?: string;
  author?: {
    authorId?: string;
    name?: string;
  };
  content?: string;
  keywords?: string[];
  published?: boolean;
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
  errorMessages?: string[];
};
export type DeleteBlogPostRes = {
  responseMsg: string;
  deletedBlogPost: IBlogPost;
  error?: any;
  errorMessages?: string[];
};

export type LikeBlogPostRes = {
  responseMsg: string;
  editedBlogPost: IBlogPost;
};

export type BlogPostErrRes = {
  responseMsg: string;
  error: any;
  errorMessages: string[];
};

export type FetchBlogPostsOpts = {
  category?: "all" | "informational" | "beginner" | "intermediate" | "advanced";
  createdAt?: "desc" | "asc";
  limit?: number;
  byUser?: boolean;
}