import { createStore, AnyAction, Store, combineReducers, compose } from 'redux';
import { createWrapper, Context, HYDRATE } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';


export interface State {
  test: string;
}

// create your reducer
const rootReducer = (state: State = { test: 'init' }, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      // Attention! This will overwrite client state! Real apps should use proper reconciliation.
      return {...state, ...action.payload};
    case 'TICK':
      return {...state, tick: action.payload};
    default:
      return state;
  }
};

const makeStore = (context: Context) => createStore(rootReducer, composeWithDevTools());

export const wrapper = createWrapper<Store<State>>(makeStore, { debug: true });