import type { BlogPostData } from "../_types/blog_posts/dataTypes";
import type { IAuthState, IBlogPostState, IUserState } from "../_types/generalTypes";

export const generateEmptyBlogPost = (): BlogPostData => {
  return {
    _id: "",
    title: "",
    author: "",
    category: "",
    keywords: [],
    content: "",
    likes: [],
    numOflikes: 0,
    live: false,
    slug: "",
    createdAt: "",
    editedAt: ""
  };
};

export const generateEmptyPostState = (): IBlogPostState => {
  return {
    status: null,
    responseMsg: "",
    loading: false,
    currentBlogPost: {
      _id: "",
      title: "",
      author: "",
      content: "",
      live: false,
      keywords: [],
      category: "",
      numOflikes: 0,
      likes: [],
      slug: "",
      editedAt: "",
      createdAt: "",
    },
    blogPosts: [],
    error: null,
    errorMessages: null
  };
};

export const generateEmptyUserState = (): IUserState => {
  return {
    status: null,
    responseMsg: "",
    loading: false,
    currentSelectedUser: {
      _id: "", firstName: "", lastName: "", email: "", confirmed: false, editedAt: "", createdAt: ""
    },
    currentLoggedInUser: {
      _id: "", firstName: "", lastName: "", email: "", confirmed: false, editedAt: "", createdAt: ""
    },
    usersArr: [],
    error: null,
    errorMessages: null
  }; 
};

export const generateEmptyAuthState = (): IAuthState => {
  return {
    status: null,
    responseMsg: "",
    loading: false,
    loggedIn: false,
    authToken: "",
    isAdmin: false,
    currentUser: null,
    error: null,
    errorMessages: null
  };
};
