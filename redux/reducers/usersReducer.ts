import type { IUserState } from "../_types/generalTypes";
import { UserAction } from "../_types/users/actionTypes";
// helpers //
import { generateEmptyUserState } from "../_helpers/mockData";

const initState: IUserState = generateEmptyUserState();

export default function usersReducer(state: IUserState = initState, action: UserAction): IUserState {
  switch(action.type) {
    case "UserAPIRequest": {
      return {
        ...state,
        loading: action.payload.loading,
        error: null,
        errorMessages: null
      };
    }
    case "GetUsers": {
      return {
        ...state,
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        usersArr: action.payload.users,
        error: null,
        errorMessages: null
      };
    }
    case "GetOneUser": {
      return {
        ...state,
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        selectedUserData: action.payload.user,
        error: null,
        errorMessages: null
      };
    }
    case "CreateUser": {
      return {
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        selectedUserData: action.payload.updatedSelectedUserData,
        usersArr: action.payload.updatedUsersArr,
        error: null,
        errorMessages: null
      };
    }
    case "EditUser": {
      return {
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        selectedUserData: action.payload.updatedSelectedUserData,
        usersArr: action.payload.updatedUsersArr,
        error: null,
        errorMessages: null
      };
    }
    case "DeleteUser": {
      return {
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        selectedUserData: action.payload.updatedSelectedUserData,
        usersArr: action.payload.updatedUsersArr,
        error: null,
        errorMessages: null
      };
    }
    case "SetUser": {
      return {
        ...state,
        selectedUserData: action.payload.userData,
        error: null,
        errorMessages: null
      };
    }
    case "ClearUser": {
      return {
        ...state,
        selectedUserData: action.payload.userData,
        error: null,
        errorMessages: null
      }
    }
    case "SetUserError": {
      return {
        ...state,
        ...action.payload
      };
    }
    case "ClearUserError": {
      return {
        ...state,
        ...action.payload
      };
    }
    default: {
      return state;
    }
  }
};
