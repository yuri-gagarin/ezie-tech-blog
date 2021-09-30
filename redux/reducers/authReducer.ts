import type { IAuthState } from "../_types/auth/dataTypes";
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
        expires: action.payload.expires,
        isAdmin: action.payload.isAdmin,
        loggedInAt: action.payload.loggedInAt,
        firebaseData: action.payload.firebaseData,
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
        expires: action.payload.expires,
        isAdmin: action.payload.isAdmin,
        loggedInAt: action.payload.loggedInAt,
        firebaseData: action.payload.firebaseData,
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
        expires: action.payload.expires,
        isAdmin: false,
        loggedIn: false,
        loggedInAt: action.payload.loggedInAt,
        firebaseData: action.payload.firebaseData,
        error: null,
        errorMessages: null
      };
    }
    case "ClearLoginState": {
      return {
        ...state,
        ...action.payload,
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
