export type BlogPostData = {
  _id: string;
  title: string;
  author: string;
  content: string;
  category: "informational" | "beginner" | "intermediate" | "expert" | "";
  slug: string;
  keywords: string[];
  live: boolean;
  editedAt: Date | string;
  createdAt: Date | string;
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