import axios from "axios";
// types 
import type { AxiosRequestConfig, AxiosResponse,  } from "axios";
import type { Dispatch } from "redux";
import type { BlogPostAction,  GetAllBlogPosts, SetBlogPost, CreateBlogPost, EditBblogPost, ToggleBlogPostLike, ClearBlogPost, DeleteBlogPost, SetBlogPostError, ClearBlogPostError } from "../_types/blog_posts/actionTypes";
import type { 
  IBlogPostState, BlogPostData, BlogPostFormData, IndexBlogPostRes, CreateBlogPostRes, FetchBlogPostsOpts, DeleteBlogPostRes, EditBlogPostRes,
  DeleteBlogPostParams,
  AuthOpts
} from "../_types/blog_posts/dataTypes";
// custom client errors //
import { ClientAuthError, ClientInputError, GeneralClientError } from "@/components/_helpers/errorHelpers";
// helpers //
import { generateEmptyBlogPost } from "../_helpers/mockData";
import { processAxiosError } from "../_helpers/dataHelpers";


export class BlogPostActions {
  // NON API related method //
  static handleSetCurrentBlogPost = (dispatch: Dispatch<BlogPostAction>, blogPostId: string, currentBlogPostState: IBlogPostState): BlogPostData => {
    const blogPost = currentBlogPostState.blogPosts.filter((blogPostData) => blogPostData._id === blogPostId)[0];
    dispatch({ type: "SetBlogPost", payload: { blogPost, currentBlogPostState } });
    return blogPost;
  }
  static handleClearCurrentBlogPost = (dispatch: Dispatch<BlogPostAction>): void => {
    const blogPost: BlogPostData = generateEmptyBlogPost();
    dispatch({ type: "ClearBlogPost", payload: { blogPost } });
  }

  static handleFetchBlogPosts = async (dispatch: Dispatch<BlogPostAction>, opts?: FetchBlogPostsOpts, auth?: AuthOpts ): Promise<GetAllBlogPosts> => {
    const fetchParams = opts ? { ...opts } : {};
    const baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL ? process.env.NEXT_PUBLIC_SERVER_BASE_URL : "";
    const headers = auth ? { Authorization: auth.JWTToken } : null;
    const reqOpts: AxiosRequestConfig = {
      method: "GET",
      url: `${baseURL}/api/posts`,
      headers: headers,
      params: fetchParams
    };

    dispatch({ type: "BlogPostsAPIRequest", payload: { responseMsg: "Loading", loading: true }});
    try {
      const res: AxiosResponse<IndexBlogPostRes> = await axios(reqOpts);
      const { status } = res;
      const { responseMsg, blogPosts } = res.data;
      return dispatch({ type: "GetBlogPosts", payload: { status, responseMsg, blogPosts, loading: false } });
    } catch (error) {
      // TODO //
      throw error;
    }
  }

  static handleSaveNewBlogPost = async ({ dispatch, JWTToken, blogPostFormData, state }: { dispatch: Dispatch<BlogPostAction>; JWTToken: string; blogPostFormData: BlogPostFormData; state: IBlogPostState }): Promise<CreateBlogPost | SetBlogPostError> => {
    if (!JWTToken) throw new ClientAuthError();
    
    const reqOpts: AxiosRequestConfig = {
      method: "POST",
      url: "/api/posts",
      headers: { "Authorization": JWTToken }, 
      data: {
        blogPostData: blogPostFormData
      }
    };

    dispatch({ type: "BlogPostsAPIRequest", payload: { responseMsg: "Loading", loading: true }});
    try {
      const res: AxiosResponse<CreateBlogPostRes> = await axios(reqOpts);
      const { status, data } = res;
      const { responseMsg, createdBlogPost } = data;
      const updatedBlogPosts = [ createdBlogPost, ...state.blogPosts ];
      return dispatch({
        type: "CreateBlogPost", payload: { status, responseMsg, createdBlogPost, updatedBlogPosts, loading: false }
      });
    } catch (error) {
      throw error;
    }
  }

  static handleEditBlogPost = async ({ dispatch, JWTToken, blogPostFormData, postId, state }: { dispatch: Dispatch<BlogPostAction>; JWTToken: string; blogPostFormData: BlogPostFormData; state: IBlogPostState; postId: string }): Promise<EditBblogPost> => {
    if (!JWTToken) throw new ClientAuthError();
    if (postId) throw new ClientInputError("Client Error", [ "Could not resolve the Blog Post id to edit" ]);

    const reqOpts: AxiosRequestConfig = {
      method: "PATCH",
      url: `/api/posts/${postId}`,
      headers: { "Authorization": JWTToken }, 
      data: {
        blogPostData: blogPostFormData
      }
    };

    dispatch({ type: "BlogPostsAPIRequest", payload: { responseMsg: "Loading", loading: true } });
    try {
      const res: AxiosResponse<EditBlogPostRes> = await axios(reqOpts);
      const { status, data } = res;
      const { responseMsg, editedBlogPost } = data;
      const updatedBlogPosts: BlogPostData[] = state.blogPosts.map((postData) => postData._id === postId ? editedBlogPost : postData);
      return dispatch({
        type: "EditBlogPost", payload: { status, responseMsg, editedBlogPost, updatedBlogPosts, loading: false }
      });
    } catch (error) {
      throw error;
    }
  }

  static handleDeleteBlogPost = async ({ dispatch, JWTToken, modelId, state }: DeleteBlogPostParams): Promise<DeleteBlogPost> => {
    const { blogPosts } = state;
    const reqOpts: AxiosRequestConfig = {
      method: "DELETE",
      headers: { "Authorization": JWTToken ? JWTToken : "" }, 
      url: `/api/posts/${modelId}`
    };

    try {
      const res: AxiosResponse<DeleteBlogPostRes> = await axios(reqOpts);
      const { status, data } = res;
      const { responseMsg, deletedBlogPost } = data;
      const updatedBlogPosts: BlogPostData[] = blogPosts.filter((blogPost) => blogPost._id !== deletedBlogPost._id);
      const updatedCurrentBlogPost: BlogPostData = generateEmptyBlogPost();
      return dispatch({
        type: "DeleteBlogPost", payload: { status, responseMsg, loading: false, updatedCurrentBlogPost, updatedBlogPosts }
      }); 
    } catch (error) {
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

    dispatch({ type: "BlogPostsAPIRequest", payload: { responseMsg: "Loading", loading: true }});
    try {
      const { status, data }: AxiosResponse<EditBlogPostRes> = await axios(reqOpts);
      const { responseMsg, editedBlogPost } = data;

      const updatedBlogPosts: BlogPostData[] = blogPosts.map((blogPostData) => {
        if (blogPostData._id === editedBlogPost._id) return editedBlogPost;
        else return blogPostData;
      });
      const updatedCurrentBlogPost: BlogPostData = currentBlogPost._id === editedBlogPost._id ? { ...editedBlogPost } : currentBlogPost;
      return dispatch({
        type: "ToggleBlogPostLike", payload: { status, responseMsg, updatedCurrentBlogPost, updatedBlogPosts, loading: false }
      });
    } catch (error) {
      throw error;
    }
  }

  static handleBlogPostError = (dispatch: Dispatch<BlogPostAction>, err: any): SetBlogPostError => {
    const { status, responseMsg, error, errorMessages } = processAxiosError(err);
    return dispatch({ 
      type: "SetBlogPostError", 
      payload: { loading: false, status, responseMsg, error, errorMessages } 
    });
  }

  static handleClearBlogPostError = (dispatch: Dispatch<BlogPostAction>): ClearBlogPostError => {
    return dispatch({
      type: "ClearBlogPostError", payload: { responseMsg: "", status: null, error: null, errorMessages: null, loading: false }
    });
  }
}

