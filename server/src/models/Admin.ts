import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import type { Document } from "mongoose";
import type { NextFunction } from "express";

export interface IAdmin extends Document  {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmed: boolean;
  role: "admin" | "owner";
  editedAt: Date;
  createdAt: Date;
  validPassword: (password: string) => Promise<boolean>;
};

const AdminSchema = new Schema<IAdmin>({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  confirmed: { type: Boolean, required: true, default: false },
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

export default mongoose.model<IAdmin>("Admin", AdminSchema);