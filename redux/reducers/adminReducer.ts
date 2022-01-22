import type { IAdminState } from "../_types/generalTypes";
import { AdminAction } from "../_types/admins/actionTypes";
// helpers //
import { generateEmptyAdminState } from "../_helpers/mockData";

const initState: IAdminState = generateEmptyAdminState();

export default function adminsReducer(state: IAdminState = initState, action: AdminAction): IAdminState {
  switch(action.type) {
    case "AdminAPIRequest": {
      return {
        ...state,
        loading: action.payload.loading,
        error: null,
        errorMessages: null
      };
    }
    case "GetAdmins": {
      return {
        ...state,
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        adminsArr: action.payload.admins,
        error: null,
        errorMessages: null
      };
    }
    case "GetOneAdmin": {
      return {
        ...state,
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        selectedAdminData: action.payload.admin,
        error: null,
        errorMessages: null
      };
    }
    case "CreateAdmin": {
      return {
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        selectedAdminData: action.payload.updatedSelectedAdminData,
        adminsArr: action.payload.updatedAdminsArr,
        error: null,
        errorMessages: null
      };
    }
    case "EditAdmin": {
      return {
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        selectedAdminData: action.payload.updatedSelectedAdminData,
        adminsArr: action.payload.updatedAdminsArr,
        error: null,
        errorMessages: null
      };
    }
    case "DeleteAdmin": {
      return {
        status: action.payload.status,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        selectedAdminData: action.payload.updatedSelectedAdminData,
        adminsArr: action.payload.updatedAdminsArr,
        error: null,
        errorMessages: null
      };
    }
    case "SetAdmin": {
      return {
        ...state,
        selectedAdminData: action.payload.adminData,
        error: null,
        errorMessages: null
      };
    }
    case "ClearAdmin": {
      return {
        ...state,
        selectedAdminData: action.payload.adminData,
        error: null,
        errorMessages: null
      }
    }
    case "SetAdminError": {
      return {
        ...state,
        ...action.payload
      };
    }
    case "ClearAdminError": {
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
