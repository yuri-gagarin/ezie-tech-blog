import axios from "../../components/axios/axiosInstance";
// types //
import type { Dispatch } from "redux";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
// actions types //
import type { AuthAPIRequest, AuthLoginSuccess, AuthLogoutSuccess, AuthLoginFailure, AuthAction, AuthErrorDismiss } from "../_types/auth/actionTypes";
// data types //
import type { AdminData } from "../_types/generalTypes";
import type { UserData } from "../_types/users/dataTypes";
import type { LoginRes, LogoutRes } from "../_types/auth/dataTypes";
// helpers //
import { processAxiosError } from '../_helpers/dataHelpers';

const authAPIRequest = (): AuthAPIRequest => {
  return {
    type: "AuthAPIRequest",
    payload: { loading: true }
  };
};
const authLoginSuccess = (data: { status: number; responseMsg: string; authToken: string; currentUser: UserData | AdminData }): AuthLoginSuccess => {
  return {
    type: "AuthLoginSuccess",
    payload: { ...data, loading: false, loggedIn: true  }
  };
};
const authLoginFailure = (data: { status: number; responseMsg: string; error: any; errorMessages: string[] }): AuthLoginFailure => {
  return {
    type: "AuthLoginFailure",
    payload: { ...data, loading: false, loggedIn: false,  authToken: "", currentUser: null }
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
      const { responseMsg, jwtToken, userData } = data;
      return dispatch(authLoginSuccess({ status, responseMsg, authToken: jwtToken.token, currentUser: userData }));
    } catch (error) {
      throw error;
    }
  }

  public static handleLogout = async (dispatch: Dispatch<AuthAction>) => {
    
  }

  public static handleLoginError = (dispatch: Dispatch<AuthAction>, err: any): AuthLoginFailure => {
    const { status, responseMsg, error, errorMessages } = processAxiosError(err);
    return dispatch(authLoginFailure({ status, responseMsg, error, errorMessages }));
  }

  public static dismissLoginError = (dispatch: Dispatch<AuthAction>): AuthErrorDismiss => {
    return dispatch({ type: "AuthErrorDismiss", payload: { error: null, errorMessages: null }});
  }
};

