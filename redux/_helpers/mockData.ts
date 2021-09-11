import type { IBlogPostState, IUserState } from "../_types/generalTypes";

export const generateEmptyPostState = (): IBlogPostState => {
  return {
    status: 200,
    responseMsg: "",
    loading: false,
    currentBlogPost: {
      _id: "",
      title: "",
      author: "",
      content: "",
      live: false,
      keywords: [],
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
    status: 200,
    responseMsg: "",
    loading: false,
    user: {
      _id: "", firstName: "", lastName: "", email: "", confirmed: false, editedAt: "", createdAt: ""
    },
    error: null,
    errorMessages: null
  }; 
};
