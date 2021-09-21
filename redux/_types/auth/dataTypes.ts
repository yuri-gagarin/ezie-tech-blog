import type { AdminData } from "../generalTypes";
import type { UserData } from "../users/dataTypes";

export type LoginRes = {
  readonly responseMsg: string;
  readonly userData: AdminData | UserData;
  readonly jwtToken: {
    token: string;
    expires: string;
  };
  readonly error?: any;
  readonly errorMessages?: string[];
};

export type RegisterRes = {
  readonly responseMsg: string;
  readonly userData: UserData;
  readonly jwtToken: {
    token: string;
    expires: string;
  };
};

export type LogoutRes = {
  readonly responseMsg: string;
};
