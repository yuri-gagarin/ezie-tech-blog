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
    case "SetUser": {
      return {
        ...state,
        selectedUserData: action.payload.userData,
        error: null,
        errorMessages: null
      };
    }
    default: {
      return state;
    }
  }
}