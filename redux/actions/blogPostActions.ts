import axios, { AxiosResponse } from "axios";
import type { AxiosRequestConfig } from "axios";
import type { Dispatch } from "redux";
import type { BlogPostAction, BlogPostAPIRequest, GetAllBlogPosts, GetBlogPostsRes, SetBlogPost, FetchBlogPostsOpts } from "../_types/blog_posts/actionTypes";
import type { IBlogPostState, BlogPostData } from "../_types/blog_posts/dataTypes";

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
  } ;
};
const setBlogPost = (data: { blogPost: BlogPostData; currentBlogPostState: IBlogPostState }): SetBlogPost => {
  return {
    type: "SetBlogPost",
    payload: { ...data }
  };
};



// non API related exports //
export const handleSetCurrentBlogPost = (dispatch: Dispatch<BlogPostAction>, blogPostId: string, currentBlogPostState: IBlogPostState): BlogPostData => {
  const blogPost = currentBlogPostState.blogPosts.filter((blogPostData) => blogPostData._id === blogPostId)[0];
  dispatch(setBlogPost({ blogPost, currentBlogPostState }));
  return blogPost;
};
export const handleFetchBlogPosts = async (dispatch: Dispatch<BlogPostAction>, opts?: FetchBlogPostsOpts): Promise<GetAllBlogPosts> => {
  const fetchParams = opts ? { ...opts } : { none: "none selected" };
  const reqOpts: AxiosRequestConfig = {
    method: "GET",
    url: "/api/posts",
    params: fetchParams
  };

  dispatch(blogPostAPIRequest());
  try {
    const res: AxiosResponse<GetBlogPostsRes> = await axios(reqOpts);
    const { status } = res;
    const { responseMsg, blogPosts } = res.data;
    return dispatch(fetchBlogPosts({ status, responseMsg, blogPosts }));
  } catch (error) {
    console.log(error);
  }
};