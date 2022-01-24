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

export type FetchAdminsOpts = {
  limit?: number;
  date?: "asc" | "desc";
};
export type GetOneAdminOpts = {
  adminId?: string;
  email?: string;
  handle?: string;
};
export type AdminFormData = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  handle?: string;
};
export type GetAllAdminsRes = {
  responseMsg: string;
  admins: AdminData[];
};
export type GetOneAdminRes = {
  responseMsg: string;
  admin: AdminData;
};
export type CreateAdminRes = {
  responseMsg: string;
  createdAdmin: AdminData;
};
export type EditAdminRes = {
  responseMsg?: string;
  editedAdmin?: AdminData;
  error?: any;
  errorMessages?: string[];
};
export type DeleteAdminRes = {
  responseMsg?: string;
  deletedAdmin?: AdminData;
  error?: any;
  errorMessages?: string[];
};

export type ErrorAdminRes = {
  responseMsg: string;
  error: any;
  errorMessages: string[];
};

