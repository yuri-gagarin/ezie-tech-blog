import type { BlogPostData } from "./blog_posts/dataTypes";
import type { BlogPostAction } from "./blog_posts/actionTypes";
// users //
import type { GenUserData } from "./users/dataTypes";
import type { UserAction } from "./users/actionTypes";
// auth //
import type { AuthAction } from "./auth/actionTypes";
// projects //
import type { ProjectAction } from "./projects/actionTypes";
import type { IProjectState } from "./projects/dataTypes";

export interface IGeneralState  {
  authState: IAuthState;
  usersState: IUserState;
  blogPostsState: IBlogPostState;
  projectsState: IProjectState;
};

export type IGeneralAppAction = BlogPostAction | UserAction | AuthAction | ProjectAction;

export interface IUserState {
  status: number | null;
  responseMsg: string;
  loading: boolean;
  selectedUserData: GenUserData;
  usersArr: GenUserData[];
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
  expires: string;
  isAdmin: boolean;
  loggedInAt: number | null;
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
