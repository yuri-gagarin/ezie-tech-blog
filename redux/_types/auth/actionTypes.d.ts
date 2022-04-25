import type { AdminData } from "../generalTypes";
import type { UserData } from "../users/dataTypes";

export type AuthAPIRequest = {
  readonly type: "AuthAPIRequest";
  readonly payload: {
    loading: boolean;
  };
};
export type ProfileAPIRequest = {
  readonly type: "ProfileAPIRequest";
  readonly payload: {
    loading: boolean;
  };
};
export type UpdateUserPassword = {
  readonly type: "UpdateUserPassword";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    currentUser: UserData;
  };
};
export type UpdateAdminPassword = {
  readonly type: "UpdateAdminPassword";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    currentUser: AdminData;
  };
}
export type UpdateUserProfile = {
  readonly type: "UpdateUserProfile";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    currentUser: UserData;
  };
};
export type UpdateAdminProfile = {
  readonly type: "UpdateAdminProfile";
  readonly payload: {
    status: number;
    responseMsg: string;
    loading: boolean;
    currentUser: AdminData;
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
    firebaseData: { adminFirebaseToken: string; expires: number } | null;
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
    firebaseData: null;
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
    firebaseData: null;
  };
};

export type ClearLoginMsg = {
  readonly type: "ClearLoginMsg";
  readonly payload: {};
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
    firebaseData: null;
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
  AuthAPIRequest | ProfileAPIRequest | UpdateUserProfile | UpdateAdminProfile | UpdateAdminPassword | UpdateUserPassword |
  AuthLoginSuccess | AuthRegisterSuccess | AuthLogoutSuccess | ClearLoginMsg | ClearLoginState | AuthFailure | AuthErrorDismiss
);

