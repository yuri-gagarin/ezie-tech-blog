import type { BlogPostData } from "./blog_posts/dataTypes";
import type { BlogPostAction } from "./blog_posts/actionTypes";
// users //
import type { UserData } from "./users/dataTypes";
import type { UserAction } from "./users/actionTypes";
// auth //
import type { AuthAction } from "./auth/actionTypes";

export interface IGeneralState  {
  authState: IAuthState;
  usersState: IUserState;
  blogPostsState: IBlogPostState;
};

export type IGeneralAppAction = BlogPostAction | UserAction | AuthAction;

export interface IUserState {
  status: number | null;
  responseMsg: string;
  loading: boolean;
  currentLoggedInUser: UserData | AdminData;
  currentSelectedUser: UserData | AdminData;
  usersArr: UserData[] | AdminData[];
  error: any | null;
  errorMessages: string[] | null;
};
export interface IBlogPostState {
  status: number | null;
  responseMsg: string;
  loading: boolean;
  blogPosts: BlogPostData[];
  currentBlogPost: BlogPostData;
  error: any;
  errorMessages: string[] | null;
};
export interface IAuthState {
  status: number | null;
  loading: boolean;
  responseMsg: string;
  loggedIn: boolean;
  authToken: string;
  currentUser: UserData | AdminData | null;
  error: any | null;
  errorMessages: any | string[];
};
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
};
