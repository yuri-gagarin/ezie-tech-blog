import { UserData } from "./dataTypes"

export type SetUser = {
  readonly type: "SetUser";
  readonly payload: {
    userData: GenUserData;
  };
};
export type ClearUser = {
  readonly type: "ClearUser";
  readonly payload: {
    userData: GenUserData;
  };
};

export type UserAPIRequest = {
  readonly type: "UserAPIRequest";
  readonly payload: {
    loading: boolean;
  };
};

// CRUD ACTION TYPES //
export type GetUsers = {
  readonly type: "GetUsers";
  readonly payload: {
    status: number; loading: boolean; responseMsg: string; users: UserData[];
  };
};
export type GetOneUser = {
  readonly type: "GetOneUser";
  readonly payload: {
    status: number; loading: boolean; responseMsg: string; user: UserData;
  };
};
export type EditUser = {
  readonly type: "EditUser";
  readonly payload: {
    status: number; loading: boolean; responseMsg: string; updatedSelectedUserData: UserData; updatedUsersArr: UserData[];
  };
};
export type CreateUser = {
  readonly type: "CreateUser";
  readonly payload: {
    status: number; loading: boolean; responseMsg: string; updatedSelectedUserData: UserData; updatedUsersArr: UserData[];
  };
};
export type DeleteUser = {
  readonly type: "DeleteUser";
  readonly payload: {
    status: number; loading: boolean; responseMsg: string; updatedSelectedUserData: UserData;  updatedUsersArr: UserData[];
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

// ERROR HANDLING //
export type SetUserError = {
  readonly type: "SetUserError";
  readonly payload: {
    status: number; loading: boolean; responseMsg: string; error: any; errorMessages: string[];
  };
};
export type ClearUserError = {
  readonly type: "ClearUserError";
  readonly payload: {
    error: null; errorMessages: null;
  };
};

export type UserAction = (
  UserAPIRequest | GetUsers | GetOneUser | EditUser | CreateUser | DeleteUser | UpdateUserPassword |
  SetUser | ClearUser | SetUserError | ClearUserError
);

