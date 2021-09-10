import type { IUser } from "../../models/User";

export type UsersIndexRes = {
  responseMsg: string;
  users: IUser[];
};
export type UsersGetOneRes = {
  responseMsg: string;
  user: IUser;
};
export type UsersCreateRes = {
  responseMsg: string;
  createdUser: IUser;
};
export type UsersEditRes = {
  responseMsg: string;
  editedUser: IUser;
};
export type UsersDeleteRes = {
  responseMsg: string;
  deletedUser: IUser;
};