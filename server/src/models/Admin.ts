import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcrypt";
import type { Document } from "mongoose";
import type { NextFunction } from "express";

export interface IAdmin extends Document  {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmed: boolean;
  role: "admin" | "owner";
  editedAt: Date;
  createdAt: Date;
  validPassword: (password: string) => Promise<boolean>;
  hashNewPassword: (password: string) => Promise<IAdmin>;
};

const AdminSchema = new Schema<IAdmin>({
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  email: { type: String, required: true },
  password: { type: String, required: true },
  confirmed: { type: Boolean, required: true },
  role: { type: String, default: "admin" },
  editedAt: { type: Date, required: true, default: new Date(Date.now()) },
  createdAt: { type: Date, required: true, default: new Date(Date.now()) }
});

AdminSchema.pre("save", async function(next: NextFunction) {
  const salt = 10;
  const passwordHash = await bcrypt.hash(this.password, salt) // using default recommended 10 salt rounds //
  this.password = passwordHash;
  next();
});

AdminSchema.methods.validPassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
}
AdminSchema.methods.hashNewPassword = async function(password: string): Promise<IAdmin> {
  this.password = password;
  return this.save();
}

export default mongoose.model<IAdmin>("Admin", AdminSchema);