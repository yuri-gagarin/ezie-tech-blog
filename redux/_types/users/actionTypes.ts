import { AdminData, UserData } from "../generalTypes";

export type SetUser = {
  readonly type: "SetUser";
  readonly payload: {
    userData: UserData | AdminData;
  };
};

export type UserAPIRequest = {
  readonly type: "UserAPIRequest";
  readonly payload: {
    loading: boolean;
    status: number;
  };
};

export type GetUsers = {
  readonly type: "GetUsers";
  readonly payload: {
    status: number; loading: boolean; responseMsg: string; users: AdminData[] | UserData[];
  };
};

export type UserAction = UserAPIRequest | SetUser | GetUsers;
