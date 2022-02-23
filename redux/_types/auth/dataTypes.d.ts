import type { AdminData } from "../generalTypes";
import type { UserData } from "../users/dataTypes";

export interface IAuthState {
  status: number | null;
  loading: boolean;
  responseMsg: string;
  loggedIn: boolean;
  showLoginMsg: boolean;
  authToken: string;
  expires: string;
  isAdmin: boolean;
  firebaseData: { adminFirebaseToken: string; expires: number } | null;
  loggedInAt: number | null;
  currentUser: UserData | AdminData | null;
  error: any | null;
  errorMessages: string[] | null;
};

export type LoginRes = {
  readonly responseMsg: string;
  readonly userData: AdminData | UserData;
  readonly success: boolean;
  readonly isAdmin: boolean;
  readonly jwtToken: {
    token: string;
    expires: string;
  };
  readonly adminFirebaseAuth: { adminFirebaseToken: string; expires: number } | null;
  readonly error?: any;
  readonly errorMessages?: string[];
};

export type RegisterRes = {
  readonly responseMsg: string;
  readonly userData: UserData;
  readonly success: boolean;
  readonly isAdmin: boolean;
  readonly jwtToken: {
    token: string;
    expires: string;
  };
  readonly error?: any;
  readonly errorMessages?: string[];
};

export type LogoutRes = {
  readonly responseMsg: string;
};
