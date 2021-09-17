import { BlogPostData, IBlogPostState } from "./dataTypes";

// api related actions //
export type BlogPostAPIRequest = {
  readonly type: "BlogPostsAPIRequest";
  readonly payload: {
    responseMsg: string;
    loading: boolean;
  };
};
export type GetAllBlogPosts = {
  readonly type: "GetBlogPosts";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    blogPosts: BlogPostData[];
  };
};
export type GetOneBlogPost = {
  readonly type: "GetOneBlogPost";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    blogPost: BlogPostData;
  };
};
export type CreateBlogPost = {
  readonly type: "CreateBlogPost";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    createdBlogPost: BlogPostData;
    updatedBlogPosts: BlogPostData[];
  };
};
export type EditBblogPost = {
  readonly type: "EditBlogPost";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    editedBlogPost: BlogPostData;
    updatedBlogPosts: BlogPostData[];
  };
};
export type DeleteBlogPost = {
  readonly type: "DeleteBlogPost";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    updatedCurrentBlogPost: BlogPostData;
    updatedBlogPosts: BlogPostData[];
  };
};
export type SetBlogPostError = {
  readonly type: "SetBlogPostError";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    error: any;
    errorMessages: string[];
  };
};
// non api actions //
export type SetBlogPost = {
  readonly type: "SetBlogPost";
  readonly payload: {
    blogPost: BlogPostData;
    currentBlogPostState: IBlogPostState;
  };
};
export type ClearBlogPost = {
  readonly type: "ClearBlogPost";
  readonly payload: {
    blogPost: BlogPostData;
  };
};

export type BlogPostAction = (BlogPostAPIRequest | GetAllBlogPosts | GetOneBlogPost | CreateBlogPost | EditBblogPost | DeleteBlogPost | SetBlogPost | SetBlogPostError);