export type UserData = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmed: boolean;
  editedAt: string;
  createdAt: string;
}
export type AdminData = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmed: boolean;
  role: "admin" | "owner";
  editedAt: string;
  createdAt: string;
};
export type GenUserData = UserData | AdminData;

export type FetchUsersOpts = {
  limit?: number;
  type?: "admin" | "user";
  date?: "asc" | "desc";
};
export type GetOneUserOpts = {
  userId?: string;
  email?: string;
  handle?: string;
};
export type UserFormData = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  handle?: string;
};
export type GetAllUsersRes = {
  responseMsg: string;
  users: UserData[];
};
export type GetOneUserRes = {
  responseMsg: string;
  user: UserData;
};
export type CreateUserRes = {
  responseMsg: string;
  createdUser: UserData;
};
export type EditUserRes = {
  responseMsg: string;
  editedUser: UserData;
};
export type DeleteUserRes = {
  responseMsg: string;
  deletedUser: UserData;
};

