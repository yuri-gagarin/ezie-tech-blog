import type { ResAdminData } from '../admins/adminTypes';
import type { ResUserData } from "../users/userTypes";

export type RegisterReqBody = {
  readonly email?: string;
  readonly password?: string;
  readonly confirmPassword?: string;
}
export type LoginResponse = {
  readonly responseMsg: string;
  readonly success: boolean;
  readonly userData: ResUserData | ResAdminData;
  readonly jwtToken: { token: string; expires: string };
};


export type RegisterResponse = {
  readonly responseMsg: string;
  readonly userData: ResUserData;
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

