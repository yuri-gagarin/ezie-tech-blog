import type { BlogPostData } from "../../server/src/_types/blog_posts/blogPostTypes";

export interface IGeneralState  {
  usersState: IUserState;
  blogPostsState: IBlogPostState;
}

export interface IUserState {
  status: number;
  responseMsg: string;
  loading: boolean;
  currentLoggedInUser: UserData | AdminData;
  currentSelectedUser: UserData | AdminData;
  usersArr: UserData[] | AdminData[];
  error: any | null;
  errorMessages: string[] | null;
}
export interface IBlogPostState {
  status: number;
  responseMsg: string;
  loading: boolean;
  blogPosts: BlogPostData[];
  currentBlogPost: BlogPostData;
  error: any;
  errorMessages: string[] | null;
}

export type UserData = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmed: boolean;
  editedAt: string;
  createdAt: string;
}
export type AdminData = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmed: boolean;
  role: "admin" | "owner";
  editedAt: string;
  createdAt: string;
}