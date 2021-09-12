import { createStore, AnyAction, Store } from 'redux';
import { useDispatch } from "react-redux";
import { createWrapper, Context, HYDRATE } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';
import combinedReducer from './reducers/combinedReducer';
import type { IGeneralAppAction, IGeneralState } from "./_types/generalTypes";
// helpers //
import { generateEmptyPostState, generateEmptyUserState } from "./_helpers/mockData";


const initialState: IGeneralState = {
  usersState: generateEmptyUserState(),
  blogPostsState: generateEmptyPostState()
};

const rootReducer = (state: IGeneralState= initialState, action: AnyAction & IGeneralAppAction): IGeneralState => {
  switch (action.type) {
    case HYDRATE:
      return {...state, ...action.payload};
    default:
      return combinedReducer(initialState, action);
  }
};

const makeStore = (context: Context) => createStore<IGeneralState, AnyAction, any, any>(rootReducer, composeWithDevTools());
export const wrapper = createWrapper<Store<IGeneralState>>(makeStore, { debug: true });