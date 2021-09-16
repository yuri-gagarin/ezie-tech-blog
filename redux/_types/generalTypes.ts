import type { BlogPostData } from "./blog_posts/dataTypes";
import type { BlogPostAction } from "./blog_posts/actionTypes";
import type { UserAction } from "./users/actionTypes";

export interface IGeneralState  {
  usersState: IUserState;
  blogPostsState: IBlogPostState;
}

export type IGeneralAppAction = BlogPostAction | UserAction;

export interface IUserState {
  status: number | null;
  responseMsg: string;
  loading: boolean;
  currentLoggedInUser: UserData | AdminData;
  currentSelectedUser: UserData | AdminData;
  usersArr: UserData[] | AdminData[];
  error: any | null;
  errorMessages: string[] | null;
}
export interface IBlogPostState {
  status: number | null;
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