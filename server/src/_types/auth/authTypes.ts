import type { AdminData } from '../admins/adminTypes';
import type { UserData } from "../users/userTypes";

export type RegisterReqBody = {
  readonly email?: string;
  readonly password?: string;
  readonly confirmPassword?: string;
};
export type DeleteProfileReqBody = {
  readonly email?: string;
  readonly password?: string;
};
export type DeleteUserProfileRes = {
  readonly responseMsg: string;
  readonly deletedUser?: UserData;
  readonly error?: any;
  readonly errorMessages?: string[];
};
export type DeleteAdminProfileRes = {
  readonly responseMsg: string;
  readonly deletedAdmin?: AdminData;
  readonly error?: any;
  readonly errorMessages?: string[];
};

export type LoginResponse = {
  readonly responseMsg: string;
  readonly success: boolean;
  readonly isAdmin: boolean;
  readonly userData: UserData| AdminData;
  readonly jwtToken: { token: string; expires: string };
  readonly adminFirebaseAuth: { adminFirebaseToken: string; expires: number } | null;
};


export type RegisterResponse = {
  readonly responseMsg: string;
  readonly userData: UserData;
  readonly isAdmin: boolean;
  readonly jwtToken: {
    token: string;
    expires: string;
  };
};

export type ErrorResponse = {
  readonly responseMsg: string;
  readonly error: any;
  readonly errorMessages: string[];
};

