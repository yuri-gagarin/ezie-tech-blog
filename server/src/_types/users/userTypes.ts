import { Types } from "mongoose";
// types //
import type { IUser } from "../../models/User";
export type ReqUserData = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  confirmed?: boolean;
  editedAt?: Date;
  createdAt?: Date;
};
export type UserData = {
  _id?: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmed?: boolean;
  editedAt?: Date;
  createdAt?: Date;
};
export type UsersIndexRes = {
  responseMsg: string;
  users: UserData[];
};
export type UsersGetOneRes = {
  responseMsg: string;
  user: UserData;
};
export type UsersCreateRes = {
  responseMsg: string;
  createdUser: UserData;
};
export type UsersEditRes = {
  responseMsg: string;
  editedUser: UserData;
};
export type UsersDeleteRes = {
  responseMsg: string;
  deletedUser: UserData;
};