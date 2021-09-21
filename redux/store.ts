import { createStore, AnyAction, Store } from 'redux';
import { createWrapper, Context, HYDRATE } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';
import combinedReducer from './reducers/combinedReducer';
import type { IGeneralAppAction, IGeneralState } from "./_types/generalTypes";
// helpers //
import { generateEmptyAuthState, generateEmptyPostState, generateEmptyUserState } from "./_helpers/mockData";
import { checkEmptyObjVals } from './_helpers/dataHelpers';

const initialState: IGeneralState = {
  authState: generateEmptyAuthState(),
  usersState: generateEmptyUserState(),
  blogPostsState: generateEmptyPostState()
};

const isClient = typeof window !== 'undefined';

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
      console.log(action.payload.authState)
      console.log(state.authState)
      return { ...state, ...action.payload };
    default:
      return combinedReducer(state, action);
  }
};

if (isClient) console.log("client request");

const makeStore = (context: Context) => createStore<IGeneralState, AnyAction, any, any>(rootReducer, composeWithDevTools());

export const wrapper = createWrapper<Store<IGeneralState>>(makeStore, { debug: false });