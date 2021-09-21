import type { IAuthState } from "../_types/generalTypes";
import type { AuthAction } from "../_types/auth/actionTypes";
// 
import { generateEmptyAuthState} from "../_helpers/mockData";

const initialState: IAuthState = generateEmptyAuthState();

export default function authReducer(state: IAuthState = initialState, action: AuthAction): IAuthState {
  switch(action.type) {
    case "AuthAPIRequest": {
      return {
        ...state,
        loading: action.payload.loading,
        error: null,
        errorMessages: null
      };
    }
    case "AuthLoginSuccess": {
      return {
        ...state,
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        loggedIn: action.payload.loggedIn,
        currentUser: action.payload.currentUser,
        authToken: action.payload.authToken,
        error: null,
        errorMessages: null
      };
    }
    case "AuthLoginFailure": {
      return {
        ...state,
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentUser: action.payload.currentUser,
        authToken: action.payload.authToken,
        loggedIn: action.payload.loggedIn,
        error: action.payload.error,
        errorMessages: action.payload.errorMessages
      };
    }
    case "AuthLogoutSuccess": {
      return {
        ...state,
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentUser: action.payload.currentUser,
        authToken: action.payload.authToken,
        loggedIn: false,
        error: null,
        errorMessages: null
      };
    }
    default: return state;
  }
};
