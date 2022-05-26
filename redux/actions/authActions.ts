import axios from "../../components/axios/axiosInstance";
// types //
import type { Dispatch } from "redux";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
// actions types //
import type { AuthAPIRequest, AuthLoginSuccess, AuthLogoutSuccess, ClearLoginMsg, AuthRegisterSuccess, AuthAction, AuthFailure, AuthErrorDismiss, ClearLoginState, UpdateCurrentUserPassword, AdminResetUserPassword } from "../_types/auth/actionTypes";
// data types //
import type { AdminData } from "../_types/generalTypes";
import type { AdminFormData, EditAdminRes, EditAdminPassRes } from "../_types/admins/dataTypes";
import type { UserData, UserFormData, EditUserRes, EditUserPassRes } from "../_types/users/dataTypes";
import type { ChangePasswordReqData, IAuthState, LoginRes, LogoutRes, RegisterRes } from "../_types/auth/dataTypes";
// helpers //
import { processAxiosError } from '../_helpers/dataHelpers';

// TODO //
// rewrite as a class //
// ALex? //

const authAPIRequest = (): AuthAPIRequest => {
  return {
    type: "AuthAPIRequest",
    payload: { loading: true }
  };
};
const authLoginSuccess = (data: { status: number; responseMsg: string; authToken: string; expires: string; isAdmin: boolean; currentUser: UserData | AdminData; firebaseData: { adminFirebaseToken: string; expires: number } | null; }): AuthLoginSuccess => {
  return {
    type: "AuthLoginSuccess",
    payload: { ...data, loading: false, loggedIn: true , loggedInAt: Date.now() }
  };
};
const authLogoutSuccess = (data: { status: number; responseMsg: string; currentUser: null }): AuthLogoutSuccess => {
  return {
    type: "AuthLogoutSuccess",
    payload: { ...data, loading: false, loggedIn: false, authToken: "", expires: "", loggedInAt: null, firebaseData: null }
  };
};
const authRegisterSuccess = (data: { status: number; responseMsg: string; currentUser: UserData; authToken: string; expires: string; isAdmin: boolean }): AuthRegisterSuccess => {
  return {
    type: "AuthRegisterSuccess",
    payload: { ...data, loading: false, loggedIn: true, loggedInAt: Date.now(), firebaseData: null }
  };
};
const authFailure = (data: { status: number; responseMsg: string; error: any; errorMessages: string[] }): AuthFailure => {
  return {
    type: "AuthFailure",
    payload: { ...data, loading: false }
  };
};

// exported handlers //
export class AuthActions {
  public static handleLogin = async (dispatch: Dispatch<AuthAction>, { email, password }: { email: string; password: string; }): Promise<AuthLoginSuccess> => {
    const axiosOpts: AxiosRequestConfig = {
      method: "POST",
      url: "/api/login",
      data: { email, password }
    };
    dispatch(authAPIRequest())
    try {
      const response: AxiosResponse<LoginRes> = await axios(axiosOpts);
      const { status, data } = response;
      const { responseMsg, jwtToken, userData, isAdmin, adminFirebaseAuth } = data;
      return dispatch(authLoginSuccess({ status, responseMsg, isAdmin, authToken: jwtToken.token, expires: jwtToken.expires, currentUser: userData, firebaseData: adminFirebaseAuth }));
    } catch (error) {
      throw error;
    }
  }

  public static handleLogout = async (dispatch: Dispatch<AuthAction>): Promise<AuthLogoutSuccess> => {
    const axiosOpts: AxiosRequestConfig = {
      method: "DELETE",
      url: "/api/logout"
    };
    dispatch(authAPIRequest());
    try {
      const response: AxiosResponse<LogoutRes> = await axios(axiosOpts);
      const { status, data } = response;
      return dispatch(authLogoutSuccess({ status, responseMsg: data.responseMsg, currentUser: null }));
    } catch (error) {
      throw error;
    }
  };

  public static handleUpdateUserProfile = async ({ dispatch, userId, formData }: { dispatch: Dispatch<AuthAction>; userId: string; JWTToken: string; formData: UserFormData }): Promise<AuthAction> => {
    const { firstName, lastName, email } = formData;
    const axiosOpts: AxiosRequestConfig = {
      method: "PATCH",
      url: `/api/users/${userId}`,
      data: {
        userData: { firstName, lastName, email }
      }
    };
    dispatch({ type: "ProfileAPIRequest", payload: { loading: true } });
    try {
      const { status, data }: AxiosResponse<EditUserRes> = await axios(axiosOpts);
      const { responseMsg, editedUser: currentUser } = data;
      return dispatch({
        type: "UpdateUserProfile",
        payload: { status, responseMsg, currentUser, loading: false }
      });
    } catch (error) {
      throw error;
    }
  };

  public static handleUpdateAdminProfile = async ({ dispatch, userId, formData }: { dispatch: Dispatch<AuthAction>; userId: string; JWTToken: string; formData: AdminFormData }): Promise<AuthAction> => {
    const { firstName, lastName, email, handle } = formData;
    const axiosOpts: AxiosRequestConfig = {
      method: "PATCH",
      url: `/api/admins/${userId}`,
      data: {
        adminData: { firstName,lastName, email, handle }
      }
    };
    dispatch({ type: "ProfileAPIRequest", payload: { loading: true } });
    try {
      const { status, data }: AxiosResponse<EditAdminRes> = await axios(axiosOpts);
      const { responseMsg, editedAdmin: currentUser } = data;
      return dispatch({
        type: "UpdateAdminProfile",
        payload: { status, responseMsg, currentUser, loading: false }
      });
    } catch (error) {
      throw error;
    }
  };
  
  public static handleClearLoginMsg = async ({ dispatch }: { dispatch: Dispatch<AuthAction>; }): Promise<any> => {
    dispatch({ type: "ClearLoginMsg", payload: {} });
  };

  public static handleRegistration = async (dispatch: Dispatch<AuthAction>, data: { email: string; password: string; confirmPassword: string; }): Promise<any> => {
    const axiosOpts: AxiosRequestConfig = {
      method: "POST",
      url: "/api/register",
      data: { ...data }
    };
    dispatch(authAPIRequest());
    try {
      const { status, data }: AxiosResponse<RegisterRes> = await axios(axiosOpts);
      const { responseMsg, userData, jwtToken, isAdmin } = data;
      return dispatch(authRegisterSuccess({ status, responseMsg, isAdmin, currentUser: userData, authToken: jwtToken.token, expires: jwtToken.expires }));
    } catch (error) {
      throw error;
    }
  };

  public static handleClearLoginState = (dispatch: Dispatch<AuthAction>): ClearLoginState => {
    return dispatch({
      type: "ClearLoginState",
      payload: {
        loggedIn: false, isAdmin: false, authToken: "", expires: "", loggedInAt: null, currentUser: null, firebaseData: null
      }
    });
  }

  public static handleAuthError = (dispatch: Dispatch<AuthAction>, err: any): AuthFailure => {
    const { status, responseMsg, error, errorMessages } = processAxiosError(err);
    return dispatch(authFailure({ status, responseMsg, error, errorMessages }));
  }

  public static dismissAuthError = (dispatch: Dispatch<AuthAction>): AuthErrorDismiss => {
    return dispatch({ type: "AuthErrorDismiss", payload: { error: null, errorMessages: null }});
  }

  public static handleUpdateUserPassword = async (data: { dispatch: Dispatch<AuthAction>; passwordData: ChangePasswordReqData; userId?: string; authState: IAuthState; }): Promise<AdminResetUserPassword | UpdateCurrentUserPassword> => {
    const { authState, dispatch } = data;
    const { isAdmin, currentUser } = authState;
    // if current user is admin, updating or resetting user password then <data.userId> should be defined //
    let userId: string = isAdmin && data.userId || currentUser._id;
    let adminResetingUserPass: boolean = isAdmin && data.userId && data.userId !== currentUser._id;
    //
    const axiosOpts: AxiosRequestConfig = {
      method: "PATCH",
      url: "/api/users/change_password",
      data: { userId, passwordData: data.passwordData }
    };

    dispatch({ type: "AuthAPIRequest", payload: { loading: true } });
    try {
      const { status, data }: AxiosResponse<EditUserPassRes> = await axios(axiosOpts);
      const { responseMsg, editedUser } = data;
      // depending on if user updated own pass or admin updated user pass, theres a different end action //
      if (adminResetingUserPass) {
        return dispatch({
          type: "AdminResetUserPassword", payload: { status, responseMsg, loading: false }
        })
      } else {
        // user updating own password, update auth state //
        return dispatch({
          type: "UpdateCurrentUserPassword", payload: { status, responseMsg, currentUser: editedUser, loading: false  }
        });
      }
    } catch (error) {
      throw error;
    }
  }

  public static handleUpdatedAdminPassword = async (data: { dispatch: Dispatch<AuthAction>; passwordData: ChangePasswordReqData; authState: IAuthState; }): Promise<UpdateCurrentUserPassword> => {
    const { dispatch, passwordData, authState } = data;
    //
    const adminId: string = authState.currentUser._id;
    //
    const axiosOpts: AxiosRequestConfig = {
      method: "PATCH",
      url: "/api/admins/change_password",
      data: { adminId, passwordData: data.passwordData }
    };

    dispatch({ type: "AuthAPIRequest", payload: { loading: true } });
    try {
      const { status, data }: AxiosResponse<EditAdminPassRes> = await axios(axiosOpts);
      const { responseMsg, editedAdmin } = data;
      // depending on if user updated own pass or admin updated user pass, theres a different end action //
      return dispatch({
        type: "UpdateCurrentUserPassword", payload: { status, responseMsg, currentUser: editedAdmin, loading: false  }
      });
    } catch (error) {
      throw error;
    }
  }
};

