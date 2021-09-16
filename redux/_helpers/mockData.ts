import type { IBlogPostState, IUserState } from "../_types/generalTypes";

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
    status: 200,
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
