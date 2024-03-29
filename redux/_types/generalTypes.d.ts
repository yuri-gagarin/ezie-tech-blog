import type { BlogPostData } from "./blog_posts/dataTypes";
import type { BlogPostAction } from "./blog_posts/actionTypes";
// users //
import type { UserData } from "./users/dataTypes";
import type { UserAction } from "./users/actionTypes";
// auth //
import type { AuthAction } from "./auth/actionTypes";
import type { IAuthState } from "./auth/dataTypes";
// projects //
import type { ProjectAction } from "./projects/actionTypes";
import type { IProjectState } from "./projects/dataTypes";
// RSS //
import type { RSSAction } from "./rss/actionTypes";
import type { IRSSState } from "./rss/dataTypes";

export interface IGeneralState  {
  authState: IAuthState;
  usersState: IUserState;
  adminState: IAdminState;
  blogPostsState: IBlogPostState;
  projectsState: IProjectState;
  rssState: IRSSState;
};

export type IGeneralAppAction = BlogPostAction | UserAction | AuthAction | ProjectAction | RSSAction;

export interface IAdminState {
  status: number | null;
  responseMsg: string;
  loading: boolean;
  selectedAdminData: AdminData;
  adminsArr: AdminData[];
  error: any | null;
  errorMessages: string[] | null;
};
export interface IUserState {
  status: number | null;
  responseMsg: string;
  loading: boolean;
  selectedUserData: UserData;
  usersArr: UserData[];
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


// general error responses //
export type GenAPIErrorRes = {
  responseMsg?: string;
  error?: any;
  errorMessages?: string[];
};
