import mongoose, { Types, Schema } from "mongoose";
import bcrypt from "bcrypt";
import type { Document, ObjectId } from "mongoose";
import type { NextFunction } from "express";

export interface IUser extends Document  {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmed: boolean;
  editedAt: Date;
  createdAt: Date;
  validPassword: (password: string) => Promise<boolean>;
};

const UserSchema = new Schema<IUser>({
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  email: { type: String, required: true },
  password: { type: String, required: true },
  confirmed: { type: Boolean, required: true },
  editedAt: { type: Date, required: true, default: new Date(Date.now()) },
  createdAt: { type: Date, required: true, default: new Date(Date.now()) }
});

UserSchema.pre("save", async function(next: NextFunction) {
  const salt = 10;
  const passwordHash = await bcrypt.hash(this.password, salt) // using default recommended 10 salt rounds //
  this.password = passwordHash;
  next();
});

UserSchema.pre("save", async function(next: NextFunction) {
  const self = this;
  try {
    const model = await mongoose.models["User"].findOne({ email: self.email }).exec()
    if (model) {
      self.invalidate("email", "email must be unique");
      next(new Error("Email already exists"));
    }
  } catch (error) {
    next(error)
  }
});
UserSchema.methods.validPassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
}

export default mongoose.model<IUser>("User", UserSchema);