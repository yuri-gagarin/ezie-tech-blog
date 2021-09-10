import type { IAdmin } from "../../models/Admin";

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