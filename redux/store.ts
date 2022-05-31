import { createStore, AnyAction, Store, applyMiddleware } from 'redux';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';
import { nextReduxCookieMiddleware, wrapMakeStore } from "next-redux-cookie-wrapper";
// combined reducer //
import combinedReducer from './reducers/combinedReducer';
// types //
import type { Context } from "next-redux-wrapper";
import type { IGeneralAppAction, IGeneralState } from "./_types/generalTypes";
// helpers //
import { generateEmptyAdminState, generateEmptyAuthState, generateEmptyPostState, generateEmptyProjectsState, generateEmptyRssState, generateEmptyUserState } from "./_helpers/mockData";
import { setCookieExpiration } from "./_helpers/generalActionHelpers";
import { checkEmptyObjVals } from './_helpers/dataHelpers';

const initialState: IGeneralState = {
  authState: generateEmptyAuthState(),
  adminState: generateEmptyAdminState(),
  usersState: generateEmptyUserState(),
  blogPostsState: generateEmptyPostState(),
  projectsState: generateEmptyProjectsState(),
  rssState: generateEmptyRssState()
};

//const isClient = typeof window !== 'undefined';

const rootReducer = (state: IGeneralState = initialState, action: AnyAction | IGeneralAppAction): IGeneralState => {
  switch (action.type) {
    case HYDRATE:
      //if (action.payload.usersState && checkEmptyObjVals(action.payload.usersState)) delete action.payload.usersStatePostsState;
      //if (action.payload.blogPostsState && checkEmptyObjVals(action.payload.blogPostsState)) delete action.payload.blogPostsState;
      // if (checkEmptyObjVals(action.payload.authState) && !checkEmptyObjVals(state.authState)) delete action.payload.authState; // guard against overwrite of authstate //
      const nextState: IGeneralState = {
        ...state,
        ...action.payload
      };
      /*
      if (checkEmptyObjVals(action.payload.authState) && !checkEmptyObjVals(state.authState)) {
        console.log(action.payload.authState);
        console.log(state.authState);
      }
      */
      console.log("Auth State is:", state.authState)
      console.log("AUTH STATE PAYLOAD IS:", action.payload.authState)
      return nextState;
    default:
      return combinedReducer(state, action);
  }
};

//if (isClient) console.log("client request");

export const store: Store<IGeneralState> = createStore<IGeneralState, AnyAction, any, any>(
  rootReducer, 
  composeWithDevTools(applyMiddleware(
    nextReduxCookieMiddleware({ subtrees: ["authState"] })
  ))
);

/*
export const store: Store<IGeneralState> = createStore<IGeneralState, AnyAction, unknown, unknown>(
  rootReducer,
  composeWithDevTools(
    applyMiddleware()
  )
);
*/
const makeStore = (context: Context) => store;
/*
const makeStore = wrapMakeStore<Store<IGeneralState>>(() => store);
const makeStore = wrapMakeStore<Store<IGeneralState>>(() => 
  createStore<IGeneralState, AnyAction, any, any>(
    rootReducer, 
    composeWithDevTools(applyMiddleware(
      nextReduxCookieMiddleware({ subtrees: ["authState"], expires: new Date(Date.now() + 3600 * 100) })
    ))
  )
);
*/

export const wrapper = createWrapper<Store<IGeneralState>>(makeStore, { debug: false });