import axios from "axios";
// type imports //
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import type { Dispatch } from "redux";
import type { IAdminState } from "../_types/generalTypes";
import type { GetOneAdmin, GetAdmins, EditAdmin, CreateAdmin, DeleteAdmin, AdminAction, SetAdminError, ClearAdminError } from "../_types/admins/actionTypes";
import type { GetAllAdminsRes, GetOneAdminRes, CreateAdminRes, EditAdminRes, DeleteAdminRes, FetchAdminsOpts, GetOneAdminOpts, AdminFormData, AdminData } from "../_types/admins/dataTypes";
// helpers //
import { generateEmptyAdmin } from "../_helpers/mockData"; 
import { processAxiosError, checkEmptyObjVals } from "../_helpers/dataHelpers";

// MESSAGE //
// I think from now on we should take the following approach to actions //
// objects rather than a list of params //
// static class methods rather than separate functions //
// Yuriy //

export class AdminActions {
  public static async handleGetAdmins(data: { dispatch: Dispatch<AdminAction>; JWTToken: string; options?: FetchAdminsOpts; }): Promise<GetAdmins | SetAdminError> {
    const { dispatch, JWTToken,  options } = data;
    // axios req conf //
    const reqConfig: AxiosRequestConfig = {
      method: "GET",
      url: "/api/admins",
      headers: { "Authorization": JWTToken },
      params: options ? options : null
    };

    dispatch({ type: "AdminAPIRequest", payload: { loading: true }});

    try {
      const { status, data }: AxiosResponse<GetAllAdminsRes> = await axios(reqConfig);
      const { responseMsg, admins } = data;
      return dispatch({ 
        type: "GetAdmins", 
        payload: { status, responseMsg, admins, loading: false }
      }); 
    } catch (error) {
      return dispatch({ type: "SetAdminError", payload: { ...processAxiosError(error), loading: false } });
    }
  }
  public static async handleGetOneAdmin(data: { dispatch: Dispatch<AdminAction>; JWTToken: string; options: GetOneAdminOpts; }): Promise<GetOneAdmin | SetAdminError> {
    const { dispatch, JWTToken, options } = data;
    // set query params //
    const queryType: "USER_ID" | "EMAIL" | "HANDLE" = options.adminId ? "USER_ID" : (options.email ? "EMAIL" : "HANDLE");
    const queryParam: string = queryType === "EMAIL" ? options.email : (queryType === "HANDLE" ? options.handle : options.adminId);
    //
    const reqConfig: AxiosRequestConfig = {
      method: "GET",
      url: `/api/admins/${queryType === "USER_ID" ? options.adminId : ""}`,
      headers: { "Authorization": JWTToken },
      params: { queryType, queryParam }
    };

    dispatch({ type: "AdminAPIRequest", payload: { loading: true }});

    try {
      const { status, data }: AxiosResponse<GetOneAdminRes> = await axios(reqConfig);
      const { responseMsg, admin } = data;
      return dispatch({ 
        type: "GetOneAdmin", 
        payload: {
          status, responseMsg, admin, loading: false
        }
      });
    } catch (err) {
      return dispatch({ type: "SetAdminError", payload: { ...processAxiosError(err), loading: false } });
    }
  }

  public static async handleCreateAdmin(data: { dispatch: Dispatch<AdminAction>; JWTToken: string; formData: AdminFormData; adminsState: IAdminState }): Promise<CreateAdmin | SetAdminError> {
    const { dispatch, JWTToken, formData, adminsState } = data;
    const { email, password, handle } = formData;
    const { adminsArr } = adminsState;

    const reqConfig: AxiosRequestConfig = {
      method: "POST",
      url: "/api/admins",
      headers: { "Authorization": JWTToken },
      data: { email, password, handle }
    };

    dispatch({ type: "AdminAPIRequest", payload: { loading: true }});

    try {
      const { status, data }: AxiosResponse<CreateAdminRes> = await axios(reqConfig);
      const { responseMsg, createdAdmin } = data;
      const updatedAdminsArr: AdminData[] = [ createdAdmin, ...adminsArr ];
      const updatedSelectedAdminData: AdminData = { ...createdAdmin };

      return dispatch({
        type: "CreateAdmin",
        payload: { status, responseMsg, updatedSelectedAdminData, updatedAdminsArr, loading: false }
      });
    } catch (error) {
      return dispatch({
        type: "SetAdminError",
        payload: { ...processAxiosError(error), loading: false }
      });
    }
  }

  public static async handleEditAdmin(data: { dispatch: Dispatch<AdminAction>; JWTToken: string; adminId: string; formData: AdminFormData; adminsState: IAdminState}): Promise<EditAdmin | SetAdminError> {
    const { dispatch, JWTToken, adminId, formData, adminsState } = data;
    const { adminsArr } = adminsState;

    const reqConfig: AxiosRequestConfig = {
      method: "PATCH",
      url: `/api/admins/${adminId}`,
      headers: { "Authorization": JWTToken }
    };

    dispatch({ type: "AdminAPIRequest", payload: { loading: true } });

    try {
      const { status, data }: AxiosResponse<EditAdminRes> = await axios(reqConfig);
      const { responseMsg, editedAdmin } = data;
      //
      const updatedAdminsArr: AdminData[] = adminsArr.map((adminData) => {
        if (adminData._id === editedAdmin._id) return { ...editedAdmin };
        else return adminData;
      });
      const updatedSelectedAdminData: AdminData = { ...editedAdmin };
      return dispatch({
        type: "EditAdmin",
        payload: { status, responseMsg, updatedSelectedAdminData, updatedAdminsArr, loading: false }
      });
    } catch (error) {
      return dispatch({
        type: "SetAdminError",
        payload: { ...processAxiosError(error), loading: false }
      });
    }
  }

  public static async handleDeleteAdmin(data: { dispatch: Dispatch<AdminAction>; JWTToken: string; adminId: string; adminsState: IAdminState; }): Promise<DeleteAdmin | SetAdminError> {
    const { dispatch, JWTToken, adminId, adminsState } = data;
    const { selectedAdminData, adminsArr } = adminsState;

    const reqConfig: AxiosRequestConfig = {
      method: "DELETE",
      url: `/api/admins/${adminId}`,
      headers: { "Authorization": JWTToken }
    };

    dispatch({ type: "AdminAPIRequest", payload: { loading: true } });

    try {
      const { status, data }: AxiosResponse<DeleteAdminRes> = await axios(reqConfig);
      const { responseMsg, deletedAdmin } = data;
      // 
      const updatedAdminsArr: AdminData[] = adminsArr.filter((adminData) => adminData._id !== deletedAdmin._id);
      const updatedSelectedAdminData: AdminData = checkEmptyObjVals(selectedAdminData) ? selectedAdminData : generateEmptyAdmin();
      return dispatch({
        type: "DeleteAdmin",
        payload: { status, responseMsg, updatedSelectedAdminData, updatedAdminsArr, loading: false }
      });
    } catch (error) {
      return dispatch({ type: "SetAdminError", payload: { ...processAxiosError(error), loading: false } });
    }
  }

  public static handleAdminError(data: { dispatch: Dispatch<SetAdminError>; error: any; status?: number; message?: string; customMessages?: string[] }): SetAdminError {
    const { dispatch, error, status = 500, message = "Application Error", customMessages } = data;
    const errorMessages: string[] = customMessages ? customMessages : [ "Seems like an error occured. Please try again," ];
    return dispatch({ type: "SetAdminError", payload: { status, loading: false, responseMsg: message,  error, errorMessages } });
  }

  public static clearAdminError({ dispatch }: { dispatch: Dispatch<ClearAdminError>; }): ClearAdminError {
    return dispatch({ type: "ClearAdminError", payload: { error: null, errorMessages: null } });
  }
};