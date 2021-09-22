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
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        loggedIn: action.payload.loggedIn,
        currentUser: action.payload.currentUser,
        authToken: action.payload.authToken,
        isAdmin: action.payload.isAdmin,
        error: null,
        errorMessages: null
      };
    }
    case "AuthRegisterSuccess": {
      return {
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        loggedIn: action.payload.loggedIn,
        currentUser: action.payload.currentUser,
        authToken: action.payload.authToken,
        isAdmin: action.payload.isAdmin,
        error: null,
        errorMessages: null
      }
    }
    case "AuthLogoutSuccess": {
      return {
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentUser: action.payload.currentUser,
        authToken: action.payload.authToken,
        isAdmin: false,
        loggedIn: false,
        error: null,
        errorMessages: null
      };
    }
    case "AuthFailure": {
      return {
        ...state,
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        error: action.payload.error,
        errorMessages: action.payload.errorMessages
      };
    }
    case "AuthErrorDismiss": {
      return {
        ...state,
        error: action.payload.error,
        errorMessages: action.payload.errorMessages
      };
    }
    default: return state;
  }
};
