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