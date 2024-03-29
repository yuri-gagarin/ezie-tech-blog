import type { IBlogPostState } from "../_types/blog_posts/dataTypes";
import type { BlogPostAction } from "../_types/blog_posts/actionTypes";
// helpers //
import{ generateEmptyPostState } from "../_helpers/mockData";
const initialState = generateEmptyPostState();

export default function blogPostsReducer(state: IBlogPostState = initialState, action: BlogPostAction): IBlogPostState {
  switch(action.type) {
    case "BlogPostsAPIRequest": {
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        error: null,
        errorMessages: null
      };
    }
    case "SetBlogPost": {
      console.log(state)
      return {
        ...state,
        ...action.payload.currentBlogPostState,
        currentBlogPost: action.payload.blogPost,
        error: null,
        errorMessages: null
      };
    };
    case "ClearBlogPost": {
      console.log("ran clear")
      console.log(state)
      return {
        ...state,
        currentBlogPost: action.payload.blogPost,
        error: null,
        errorMessages: null
      };
    };
    case "GetBlogPosts": {
      return {
        ...state,
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        blogPosts: action.payload.blogPosts,
        error: null,
        errorMessages: null
      };
    }
    case "GetOneBlogPost": {
      return {
        ...state,
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentBlogPost: action.payload.blogPost,
        error: null,
        errorMessages: null
      };
    }
    case "CreateBlogPost": {
      return {
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentBlogPost: action.payload.createdBlogPost,
        blogPosts: action.payload.updatedBlogPosts,
        error: null,
        errorMessages: null
      };
    }
    case "EditBlogPost": {
      return {
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentBlogPost: action.payload.editedBlogPost,
        blogPosts: action.payload.updatedBlogPosts,
        error: null,
        errorMessages: null
      };
    }
    case "DeleteBlogPost": {
      return {
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentBlogPost: action.payload.updatedCurrentBlogPost,
        blogPosts: action.payload.updatedBlogPosts,
        error: null,
        errorMessages: null
      };
    }
    case "ToggleBlogPostLike": {
      return {
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentBlogPost: action.payload.updatedCurrentBlogPost,
        blogPosts: action.payload.updatedBlogPosts,
        error: null,
        errorMessages: null
      };
    }
    case "SetBlogPostError": {
      return {
        ...state,
        ...action.payload
      }
    }
    default: {
      return state;
    }
  }
};
