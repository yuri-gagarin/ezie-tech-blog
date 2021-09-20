import type { IAdmin } from "../../models/Admin";

export type ResAdminData = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmed?: boolean;
  role?: "admin" | "owner";
  editedAt?: Date;
  createdAt?: Date;
};

export type AdminsIndexRes = {
  responseMsg: string;
  admins: IAdmin[];
};
export type AdminsGetOneRes = {
  responseMsg: string;
  admin: IAdmin;
};
export type AdminsCreateRes = {
  responseMsg: string;
  createdAdmin: IAdmin;
};
export type AdminsEditRes = {
  responseMsg: string;
  editedAdmin: IAdmin;
};
export type AdminsDeleteRes = {
  responseMsg: string;
  deletedAdmin: IAdmin;
};