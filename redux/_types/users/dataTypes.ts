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
}