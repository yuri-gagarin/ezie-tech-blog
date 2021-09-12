import axios, { AxiosResponse } from "axios";
import type { AxiosRequestConfig } from "axios";
import type { Dispatch } from "redux";
import type { BlogPostData } from "../../server/src/_types/blog_posts/blogPostTypes";
import type { BlogPostAction, BlogPostAPIRequest, GetAllBlogPosts, GetBlogPostsRes } from "../_types/blog_posts/actionTypes";

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

export const handleFetchBlogPosts = async (dispatch: Dispatch<BlogPostAction>): Promise<GetAllBlogPosts> => {
  const reqOpts: AxiosRequestConfig = {
    method: "GET",
    url: "/api/posts"
  };

  dispatch(blogPostAPIRequest());
  try {
    const res: AxiosResponse<GetBlogPostsRes> = await axios(reqOpts);
    const { status } = res;
    const { responseMsg, posts } = res.data;
    return fetchBlogPosts({ status, responseMsg, blogPosts: posts });
  } catch (error) {

  }
};