import axios, { AxiosResponse } from "axios";
import type { AxiosRequestConfig } from "axios";
import type { Dispatch } from "redux";
import type { BlogPostAction, BlogPostAPIRequest, GetAllBlogPosts, SetBlogPost, CreateBlogPost, ToggleBlogPostLike, ClearBlogPost, DeleteBlogPost } from "../_types/blog_posts/actionTypes";
import type { IBlogPostState, BlogPostData, BlogPostFormData, IndexBlogPostRes, CreateBlogPostRes, FetchBlogPostsOpts, DeleteBlogPostRes, EditBlogPostRes } from "../_types/blog_posts/dataTypes";
// helpers //
import { generateEmptyBlogPost } from "../_helpers/mockData";
import { processAxiosError } from "../_helpers/dataHelpers";

const blogPostAPIRequest = (): BlogPostAPIRequest => {
  return {
    type: "BlogPostsAPIRequest",
    payload: { loading: true, responseMsg: "Loading" }
  };
};
const fetchBlogPosts = (data: { status: number; responseMsg: string; blogPosts: BlogPostData[] }): GetAllBlogPosts => {
  return {
    type: "GetBlogPosts",
    payload: { ...data, loading: false }
  };
};
const createBlogPost = (data: { status: number; responseMsg: string; createdBlogPost: BlogPostData; updatedBlogPosts: BlogPostData[] }): CreateBlogPost => {
  return {
    type: "CreateBlogPost",
    payload: { ...data, loading: false }
  };
};
const deleteBlogPost = (data: { status: number; responseMsg: string; updatedCurrentBlogPost: BlogPostData; updatedBlogPosts: BlogPostData[] }): DeleteBlogPost => {
  return {
    type: "DeleteBlogPost",
    payload: { ...data, loading: false }
  };
};
const toggleBlogPostLike = (data: { status: number; responseMsg: string, updatedCurrentBlogPost: BlogPostData; updatedBlogPosts: BlogPostData[] }): ToggleBlogPostLike => {
  return {
    type: "ToggleBlogPostLike",
    payload: { ...data,  loading: false }
  };
};
const setBlogPost = (data: { blogPost: BlogPostData; currentBlogPostState: IBlogPostState }): SetBlogPost => {
  return {
    type: "SetBlogPost",
    payload: { ...data }
  };
};
const clearBlogPost = (data: { blogPost: BlogPostData }): ClearBlogPost => {
  return {
    type: "ClearBlogPost",
    payload: { ...data }
  };
};



export class BlogPostActions {
  // NON API related method //
  static handleSetCurrentBlogPost = (dispatch: Dispatch<BlogPostAction>, blogPostId: string, currentBlogPostState: IBlogPostState): BlogPostData => {
    const blogPost = currentBlogPostState.blogPosts.filter((blogPostData) => blogPostData._id === blogPostId)[0];
    dispatch(setBlogPost({ blogPost, currentBlogPostState }));
    return blogPost;
  };
  static handleClearCurrentBlogPost = (dispatch: Dispatch<BlogPostAction>): void => {
    const blogPost: BlogPostData = generateEmptyBlogPost();
    dispatch(clearBlogPost({ blogPost }));
  }

  static handleFetchBlogPosts = async (dispatch: Dispatch<BlogPostAction>, opts?: FetchBlogPostsOpts): Promise<GetAllBlogPosts> => {
    const fetchParams = opts ? { ...opts } : { none: "none selected" };
    const baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL ? process.env.NEXT_PUBLIC_SERVER_BASE_URL : "";
    const reqOpts: AxiosRequestConfig = {
      method: "GET",
      url: `${baseURL}/api/posts`,
      params: fetchParams
    };

    dispatch(blogPostAPIRequest());
    try {
      const res: AxiosResponse<IndexBlogPostRes> = await axios(reqOpts);
      const { status } = res;
      const { responseMsg, blogPosts } = res.data;
      return dispatch(fetchBlogPosts({ status, responseMsg, blogPosts }));
    } catch (error) {
      // TODO //
      throw error;
    }
  }

  static handleSaveNewBlogPost = async (dispatch: Dispatch<BlogPostAction>, blogPostFormData: BlogPostFormData, currentBlogPostState: IBlogPostState): Promise<CreateBlogPost> => {
    const { title, author, category, keywords } = blogPostFormData;
    const token: string | null = localStorage.getItem("jwtToken");
    const reqOpts: AxiosRequestConfig = {
      method: "POST",
      url: "/api/posts",
      headers: { "Authorization": token ? token : "" }, 
      data: { title, author, category, keywords }
    };

    dispatch(blogPostAPIRequest());
    try {
      const res: AxiosResponse<CreateBlogPostRes> = await axios(reqOpts);
      const { status, data } = res;
      const { responseMsg, createdBlogPost } = data;
      const updatedBlogPosts = [ createdBlogPost, ...currentBlogPostState.blogPosts ];
      return dispatch(createBlogPost({ status, responseMsg, createdBlogPost, updatedBlogPosts }))
    } catch (error) {
      // TODO //
      throw error;
    }
  }

  static handleDeleteBlogPost = async (dispatch: Dispatch<BlogPostAction>, blogPostId: string, currentBlogPostState: IBlogPostState): Promise<DeleteBlogPost> => {
    const { blogPosts } = currentBlogPostState;
    const token: string | null = localStorage.getItem("jwtToken");
    const reqOpts: AxiosRequestConfig = {
      method: "DELETE",
      headers: { "Authorization": token ? token : "" }, 
      url: "/api/posts/" + blogPostId 
    };

    try {
      const res: AxiosResponse<DeleteBlogPostRes> = await axios(reqOpts);
      const { status, data } = res;
      const { responseMsg, deletedBlogPost } = data;
      const updatedBlogPosts: BlogPostData[] = blogPosts.filter((blogPost) => blogPost._id !== deletedBlogPost._id);
      const updatedCurrentBlogPost: BlogPostData = generateEmptyBlogPost();
      return dispatch(deleteBlogPost({ status, responseMsg, updatedCurrentBlogPost, updatedBlogPosts })); 
    } catch (error) {
      // TODO //
      throw error;
    }
  }

  static handleToggleBlogPostLike = async (dispatch: Dispatch<BlogPostAction>, blogPostId: string, jwtToken: string, currentBlogPostState: IBlogPostState): Promise<ToggleBlogPostLike> => {
    const { currentBlogPost, blogPosts } = currentBlogPostState;
    const reqOpts: AxiosRequestConfig = {
      method: "PATCH",
      headers: { "Authorization": jwtToken },
      url: `/api/posts/toggle_like/${blogPostId}`
    };

    dispatch(blogPostAPIRequest());
    try {
      const { status, data }: AxiosResponse<EditBlogPostRes> = await axios(reqOpts);
      const { responseMsg, editedBlogPost } = data;

      const updatedBlogPosts: BlogPostData[] = blogPosts.map((blogPostData) => {
        if (blogPostData._id === editedBlogPost._id) return editedBlogPost;
        else return blogPostData;
      });
      const updatedCurrentBlogPost: BlogPostData = currentBlogPost._id === editedBlogPost._id ? { ...editedBlogPost } : currentBlogPost;
      return dispatch(toggleBlogPostLike({ status, responseMsg, updatedCurrentBlogPost, updatedBlogPosts }));
    } catch (error) {
      throw error;
    }
  }

  static handleBlogPostError = (dispatch: Dispatch<BlogPostAction>, err: any): void => {
    const { status, responseMsg, error, errorMessages } = processAxiosError(err);
    dispatch({ 
      type: "SetBlogPostError", 
      payload: { loading: false, status, responseMsg, error, errorMessages } 
    });
  }
}

