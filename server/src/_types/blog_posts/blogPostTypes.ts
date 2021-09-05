import type { IBlogPost } from "../../models/BlogPost";

export type BlogPostData = {
  _id: string;
  title: string;
  author: string;
  content: string;
  keywords: string[];
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
  blogPosts?: IBlogPost[];
  error?: any;
}
export type OneBlogPostRes = {
  responseMsg: string;
  blogPost?: IBlogPost;
  error?: any;
};
export type CreateBlogPostRes = {
  responseMsg: string;
  createdBlogPost?: IBlogPost;
  error?: any;
};
export type EditBlogPostRes = {
  responseMsg: string;
  editedBlogPost?: IBlogPost;
  error?: any;
};
export type DeleteBlogPostRes = {
  responseMsg: string;
  deletedBlogPost?: IBlogPost;
  error?: any;
};
