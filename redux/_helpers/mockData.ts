import type { BlogPostData } from "../_types/blog_posts/dataTypes";
import type { IBlogPostState, IUserState } from "../_types/generalTypes";
import type { IAuthState } from "../_types/auth/dataTypes";
import type { IProjectState } from "../_types/projects/dataTypes";
import type { UserData } from "../_types/users/dataTypes";
import type { IRSSState } from "../_types/rss/dataTypes";

export const generateEmptyBlogPost = (): BlogPostData => {
  return {
    _id: "",
    title: "",
    author: { authorId: "", name: "" },
    category: "",
    keywords: [],
    content: "",
    likes: [],
    numOflikes: 0,
    published: false,
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
    currentBlogPost: generateEmptyBlogPost(),
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
    firebaseData: null,
    loggedInAt: null,
    isAdmin: false,
    currentUser: null,
    error: null,
    errorMessages: null
  };
};

// project state related //
export const generateEmptyProjectsState = (): IProjectState => {
  return {
    status: null,
    responseMsg: "",
    loading: false,
    currentSelectedProject: null,
    projectsArr: [],
    currentProjectImages: null,
    error: null,
    errorMessages: null
  };
};


export const generateEmptyRssState = (): IRSSState => {
  return {
    status: null,
    loading: false,
    responseMsg: "",
    source: "",
    logoURL: "",
    title: "",
    lastItemId: "",
    currentPage: 0,
    rssFeed: [],
    readingList: [],
    error: null,
    errorMessages: null
  }
}
