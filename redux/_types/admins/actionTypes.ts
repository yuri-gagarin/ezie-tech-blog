import { AdminData } from "./dataTypes"

export type SetAdmin = {
  readonly type: "SetAdmin";
  readonly payload: {
    userData: GenAdminData;
  };
};
export type ClearAdmin = {
  readonly type: "ClearAdmin";
  readonly payload: {
    userData: GenAdminData;
  };
};

export type AdminAPIRequest = {
  readonly type: "AdminAPIRequest";
  readonly payload: {
    loading: boolean;
  };
};

// CRUD ACTION TYPES //
export type GetAdmins = {
  readonly type: "GetAdmins";
  readonly payload: {
    status: number; loading: boolean; responseMsg: string; users: AdminData[];
  };
};
export type GetOneAdmin = {
  readonly type: "GetOneAdmin";
  readonly payload: {
    status: number; loading: boolean; responseMsg: string; user: AdminData;
  };
};
export type EditAdmin = {
  readonly type: "EditAdmin";
  readonly payload: {
    status: number; loading: boolean; responseMsg: string; updatedSelectedAdminData: AdminData; updatedAdminsArr: AdminData[];
  };
};
export type CreateAdmin = {
  readonly type: "CreateAdmin";
  readonly payload: {
    status: number; loading: boolean; responseMsg: string; updatedSelectedAdminData: AdminData; updatedAdminsArr: AdminData[];
  };
};
export type DeleteAdmin = {
  readonly type: "DeleteAdmin";
  readonly payload: {
    status: number; loading: boolean; responseMsg: string; updatedSelectedAdminData: AdminData;  updatedAdminsArr: AdminData[];
  };
};

// ERROR HANDLING //
export type SetAdminError = {
  readonly type: "SetAdminError";
  readonly payload: {
    status: number; loading: boolean; responseMsg: string; error: any; errorMessages: string[];
  };
};
export type ClearAdminError = {
  readonly type: "ClearAdminError";
  readonly payload: {
    error: null; errorMessages: null;
  };
};

export type AdminAction = (
  AdminAPIRequest | GetAdmins | GetOneAdmin | EditAdmin | CreateAdmin | DeleteAdmin |
  SetAdmin | ClearAdmin | SetAdminError | ClearAdminError
);

