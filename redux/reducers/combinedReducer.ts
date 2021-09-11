import { AnyAction, combineReducers } from "redux";
import type { IGeneralState } from "../_types/generalTypes";
import blogPostsReducer from "./blogPostsReducer";
import usersReducer from "./usersReducer";

/*
export default function combinedReducer(): IGeneralState {
  return combineReducers<IGeneralState>({
    usersState: usersReducer,
    blogPostsState: blogPostsReducer
  })
}
*/
export default combineReducers<IGeneralState, AnyAction>({
  usersState: usersReducer,
  blogPostsState: blogPostsReducer
});
