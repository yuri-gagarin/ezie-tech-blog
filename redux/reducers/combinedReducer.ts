import { combineReducers } from "redux";
import type { AnyAction } from "redux";
import type { IGeneralAppAction, IGeneralState } from "../_types/generalTypes";
// reducers //
import authReducer from "./authReducer";
import blogPostsReducer from "./blogPostsReducer";
import projectsReducer from "./projectsReducer";
import usersReducer from "./usersReducer";
import RSSReducer from "./rssReducer";

export default combineReducers<IGeneralState, IGeneralAppAction | AnyAction>({
  authState: authReducer,
  usersState: usersReducer,
  projectsState: projectsReducer,
  blogPostsState: blogPostsReducer,
  rssState: RSSReducer
});
