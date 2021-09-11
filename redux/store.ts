import { createStore, AnyAction, Store, combineReducers, compose } from 'redux';
import { createWrapper, Context, HYDRATE } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';
import type { IGeneralState } from "./_types/generalTypes";
// helpers //
import { generateEmptyPostState, generateEmptyUserState } from "./_helpers/mockData";


export interface State extends IGeneralState {
  test: string;
}

const initialState: State = {
  test: "init",
  userState: generateEmptyUserState(),
  blogPostState: generateEmptyPostState()
};

const rootReducer = (state: State = initialState, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      return {...state, ...action.payload};
    case 'TICK':
      return {...state, tick: action.payload};
    default:
      return state;
  }
};

const makeStore = (context: Context) => createStore(rootReducer, composeWithDevTools());

export const wrapper = createWrapper<Store<State>>(makeStore, { debug: true });