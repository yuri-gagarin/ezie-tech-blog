import type { AdminData } from "../generalTypes";
import type { UserData } from "../users/dataTypes";

export type LoginRes = {
  readonly responseMsg: string;
  readonly userData: AdminData | UserData;
  readonly token: string;
  readonly error?: any;
  readonly errorMessages?: string[];
};

export type LogoutRes = {
  readonly responseMsg: string;
};