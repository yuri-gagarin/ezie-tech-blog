import { Types } from "mongoose";
import type { IAdmin } from "../../models/Admin";

export type AdminData = {
  _id?: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmed?: boolean;
  role?: "admin" | "owner";
  editedAt?: Date;
  createdAt?: Date;
};

export type FetchAdminsOpts = {
  limit?: number;
  date?: "asc" | "desc";
};

export type AdminsIndexRes = {
  responseMsg: string;
  admins: AdminData[];
};
export type AdminsGetOneRes = {
  responseMsg: string;
  admin: AdminData;
};
export type AdminsCreateRes = {
  responseMsg: string;
  createdAdmin: AdminData;
};
export type AdminsEditRes = {
  responseMsg: string;
  editedAdmin: AdminData;
};
export type AdminsDeleteRes = {
  responseMsg: string;
  deletedAdmin: AdminData;
};