import type { AdminData } from "../generalTypes";
import type { UserData } from "../users/dataTypes";

export type AuthAPIRequest = {
  readonly type: "AuthAPIRequest";
  readonly payload: {
    loading: boolean;
  };
};

export type AuthLoginSuccess = {
  readonly type: "AuthLoginSuccess";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    loggedIn: boolean;
    authToken: string;
    currentUser: AdminData | UserData;
  };
};

export type AuthLoginFailure = {
  readonly type: "AuthLoginFailure";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    loggedIn: boolean;
    authToken: string;
    currentUser: null;
    error: any;
    errorMessages: string[];
  };
};

export type AuthLogoutSuccess = {
  readonly type: "AuthLogoutSuccess";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    loggedIn: boolean;
    authToken: string;
    currentUser: null;
  };
};

export type AuthErrorDismiss = {
  readonly type: "AuthErrorDismiss";
  readonly payload: {
    error: null, errorMessages: null
  };
};

export type AuthAction = AuthAPIRequest | AuthLoginSuccess | AuthLoginFailure | AuthLogoutSuccess | AuthErrorDismiss;


