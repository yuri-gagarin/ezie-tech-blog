import { AnyAction, combineReducers } from "redux";
import type { IGeneralAppAction, IGeneralState } from "../_types/generalTypes";
// reducers //
import authReducer from "./authReducer";
import blogPostsReducer from "./blogPostsReducer";
import projectsReducer from "./projectsReducer";
import usersReducer from "./usersReducer";

export default combineReducers<IGeneralState, IGeneralAppAction | AnyAction>({
  authState: authReducer,
  usersState: usersReducer,
  projectsState: projectsReducer,
  blogPostsState: blogPostsReducer
});
