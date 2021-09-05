import mongoose, { Schema } from "mongoose";
import type { Document } from "mongoose";

export interface IBlogPost extends Document  {
  title: string;
  author: string;
  content: string;
  keywords: string[];
  live: boolean;
  editedAt: Date;
  createdAt: Date;
};

const blogPostSchema = new Schema<IBlogPost>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  keywords: { type: [ String ], required: false, default: [] },
  live: { type: Boolean, required: true, default: false },
  editedAt: { type: Date, required: true, default: new Date(Date.now()) },
  createdAt: { type: Date, required: true, default: new Date(Date.now()) }
});

export default mongoose.model<IBlogPost>("BlogPost", blogPostSchema);