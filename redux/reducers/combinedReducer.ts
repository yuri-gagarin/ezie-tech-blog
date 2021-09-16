import { AnyAction, combineReducers } from "redux";
import type { IGeneralAppAction, IGeneralState } from "../_types/generalTypes";
import blogPostsReducer from "./blogPostsReducer";
import usersReducer from "./usersReducer";

export default combineReducers<IGeneralState, IGeneralAppAction | AnyAction>({
  usersState: usersReducer,
  blogPostsState: blogPostsReducer
});
