import axios from "axios";
// types 
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { Dispatch } from "redux";
import type { BlogPostAction, BlogPostAPIRequest, GetAllBlogPosts, SetBlogPost, CreateBlogPost, ToggleBlogPostLike, ClearBlogPost, DeleteBlogPost, SetBlogPostError } from "../_types/blog_posts/actionTypes";
import type { 
  IBlogPostState, BlogPostData, BlogPostFormData, IndexBlogPostRes, CreateBlogPostRes, FetchBlogPostsOpts, DeleteBlogPostRes, EditBlogPostRes,
  DeleteBlogPostParams
} from "../_types/blog_posts/dataTypes";
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
    const fetchParams = opts ? { ...opts } : {};
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

  static handleSaveNewBlogPost = async ({ dispatch, JWTToken, blogPostFormData, state }: { dispatch: Dispatch<BlogPostAction>; JWTToken: string; blogPostFormData: BlogPostFormData; state: IBlogPostState }): Promise<CreateBlogPost | SetBlogPostError> => {
    console.log("clicked")
    console.log("should be here");
    if (!JWTToken) throw new Error("Could Not resolve")
    const { title, author, category, keywords } = blogPostFormData;
    const reqOpts: AxiosRequestConfig = {
      method: "POST",
      url: "/api/posts",
      headers: { "Authorization": JWTToken }, 
      data: { title, author, category, keywords }
    };

    dispatch(blogPostAPIRequest());
    try {
      const res: AxiosResponse<CreateBlogPostRes> = await axios(reqOpts);
      const { status, data } = res;
      const { responseMsg, createdBlogPost } = data;
      const updatedBlogPosts = [ createdBlogPost, ...state.blogPosts ];
      console.log(createdBlogPost)
      return dispatch(createBlogPost({ status, responseMsg, createdBlogPost, updatedBlogPosts }))
    } catch (error) {
      // TODO //
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

