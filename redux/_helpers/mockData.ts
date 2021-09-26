import type { BlogPostData } from "../_types/blog_posts/dataTypes";
import type { IAuthState, IBlogPostState, IUserState } from "../_types/generalTypes";
import { IProjectState } from "../_types/projects/dataTypes";
import { UserData } from "../_types/users/dataTypes";

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

export const generateEmptyUser = (): UserData => {
  return {
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    confirmed: false,
    editedAt: "",
    createdAt: ""
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
    selectedUserData: {
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
    expires: "",
    loggedInAt: null,
    isAdmin: false,
    currentUser: null,
    error: null,
    errorMessages: null
  };
};

export const generateEmptyProjectsState = (): IProjectState => {
  return {
    status: null,
    responseMsg: "",
    loading: false,
    currentSelectedProject: null,
    projectsArr: [],
    error: null,
    errorMessages: null
  };
};

