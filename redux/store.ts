import { createStore, AnyAction, Store, applyMiddleware } from 'redux';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';
import { nextReduxCookieMiddleware, wrapMakeStore } from "next-redux-cookie-wrapper";
// combined reducer //
import combinedReducer from './reducers/combinedReducer';
// types //
import type { IGeneralAppAction, IGeneralState } from "./_types/generalTypes";
// helpers //
import { generateEmptyAuthState, generateEmptyPostState, generateEmptyProjectsState, generateEmptyRssState, generateEmptyUserState } from "./_helpers/mockData";
//import { checkEmptyObjVals } from './_helpers/dataHelpers';

const initialState: IGeneralState = {
  authState: generateEmptyAuthState(),
  usersState: generateEmptyUserState(),
  blogPostsState: generateEmptyPostState(),
  projectsState: generateEmptyProjectsState(),
  rssState: generateEmptyRssState()
};

//const isClient = typeof window !== 'undefined';

const rootReducer = (state: IGeneralState = initialState, action: AnyAction | IGeneralAppAction): IGeneralState => {
  switch (action.type) {
    case HYDRATE:
      //let nextState: IGeneralState;
      /*
      if (checkEmptyObjVals(state.blogPostsState) && checkEmptyObjVals(action.payload)) {
        nextState = { ...state, ...action.payload };
      } else {
        console.log(24);
        console.log(state.blogPostsState);
        nextState = { ...state, ...action.payload, ...state.blogPostsState };

      }
      */
      //if (action.payload.usersState && checkEmptyObjVals(action.payload.usersState)) delete action.payload.usersStatePostsState;
      //if (action.payload.blogPostsState && checkEmptyObjVals(action.payload.blogPostsState)) delete action.payload.blogPostsState;
      //console.log(action.payload)
      return { ...state, ...action.payload };
    default:
      return combinedReducer(state, action);
  }
};

//if (isClient) console.log("client request");

const makeStore = wrapMakeStore<Store<IGeneralState>>(() => 
  createStore<IGeneralState, AnyAction, any, any>(
    rootReducer, 
    composeWithDevTools(applyMiddleware(
      nextReduxCookieMiddleware({ subtrees: ["authState"], expires: new Date(Date.now() + 3600 * 100) })
    ))
  )
);

export const wrapper = createWrapper<Store<IGeneralState>>(makeStore, { debug: false });