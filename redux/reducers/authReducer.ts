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
    case "AuthPassChangeAPIRequest": {
      return {
        ...state,
        ...action.payload,
        error: null,
        errorMessages: null
      };
    }
    case "ProfileAPIRequest": {
      return {
        ...state,
        loading: action.payload.loading
      };
    }
    // password updates and reset //
    case "AdminResetUserPassword": {
      return {
        ...state,
        ...action.payload,
        error: null,
        errorMessages: null
      };
    }
    case "UpdateCurrentUserPassword": {
      return {
        ...state,
        ...action.payload,
        error: null,
        errorMessages: null
      };
    }
    case "UpdateUserProfile": {
      return {
        ...state,
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentUser: {
          ...action.payload.currentUser
        }
      };
    }
    case "UpdateAdminProfile": {
      return {
        ...state,
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentUser: {
          ...action.payload.currentUser
        }
      };
    }
    case "DeleteUserProfile": {
      return {
        ...state,
        ...action.payload,
        error: null, 
        errorMessages: null
      };
    };
    case "AuthLoginSuccess": {
      return {
        ...state,
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        loggedIn: action.payload.loggedIn,
        showLoginMsg: true,
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
        ...state,
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        loggedIn: action.payload.loggedIn,
        showLoginMsg: false,
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
        ...state,
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentUser: action.payload.currentUser,
        authToken: action.payload.authToken,
        expires: action.payload.expires,
        isAdmin: false,
        loggedIn: false,
        showLoginMsg: true,
        loggedInAt: action.payload.loggedInAt,
        firebaseData: action.payload.firebaseData,
        error: null,
        errorMessages: null
      };
    }
    case "ClearLoginMsg": {
      return {
        ...state,
        showLoginMsg: false
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
        passwordChangeRequest: false,
        error: action.payload.error,
        errorMessages: action.payload.errorMessages
      };
    }
    default: return state;
  }
};
