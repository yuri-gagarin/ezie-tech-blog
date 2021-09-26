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
    isAdmin: boolean;
    authToken: string;
    expires: string;
    currentUser: AdminData | UserData;
    loggedInAt: number;
  };
};

export type AuthRegisterSuccess = {
  readonly type: "AuthRegisterSuccess";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    loggedIn: boolean;
    isAdmin: boolean;
    authToken: string;
    expires: string;
    currentUser: UserData;
    loggedInAt: number;
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
    expires: string;
    currentUser: null;
    loggedInAt: null;
  };
};

export type ClearLoginState = {
  readonly type: "ClearLoginState";
  readonly payload: {
    loggedIn: boolean;
    isAdmin: boolean;
    authToken: string;
    expires: string;
    currentUser: null;
    loggedInAt: null;
  };
};

export type AuthFailure = {
  readonly type: "AuthFailure";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    error: any;
    errorMessages: string[];
  };
};


export type AuthErrorDismiss = {
  readonly type: "AuthErrorDismiss";
  readonly payload: {
    error: null, errorMessages: null
  };
};

export type AuthAction = (
    AuthAPIRequest | AuthLoginSuccess | AuthLogoutSuccess | AuthRegisterSuccess | ClearLoginState | AuthFailure | AuthErrorDismiss
);



