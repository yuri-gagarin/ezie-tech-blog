import axios from "../../components/axios/axiosInstance";
// types //
import type { Dispatch } from "redux";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
// actions types //
import type { AuthAPIRequest, AuthLoginSuccess, AuthLogoutSuccess, AuthRegisterSuccess, AuthAction, AuthFailure, AuthErrorDismiss, ClearLoginState } from "../_types/auth/actionTypes";
// data types //
import type { AdminData } from "../_types/generalTypes";
import type { UserData } from "../_types/users/dataTypes";
import type { LoginRes, LogoutRes, RegisterRes } from "../_types/auth/dataTypes";
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
};

