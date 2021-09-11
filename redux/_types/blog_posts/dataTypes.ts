import type { BlogPostData } from "../../../server/src/_types/blog_posts/blogPostTypes";

export interface IBlogPostState {
  status: number;
  responseMsg: string;
  loading: boolean;
  blogPosts: BlogPostData[];
  currentBlogPost: BlogPostData;
  error: any;
  errorMessages: string[] | null;
}