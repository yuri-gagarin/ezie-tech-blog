import type { ResAdminData } from '../admins/adminTypes';
import type { ResUserData } from "../users/userTypes";

export type LoginResponse = {
  responseMsg: string;
  success: boolean;
  userData: ResUserData | ResAdminData;
  jwtToken: { token: string; expires: string };
};

export type ErrorResponse = {
  responseMsg: string;
  error: any;
  errorMessages: string[];
};

