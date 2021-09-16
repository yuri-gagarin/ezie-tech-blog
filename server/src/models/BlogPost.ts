import mongoose, { Schema } from "mongoose";
import type { Document } from "mongoose";
import type { NextFunction } from "express";

export interface IBlogPost extends Document  {
  title: string;
  author: string;
  content: string;
  category: "informational" | "beginner" | "intermediate" | "advanced";
  keywords: string[];
  slug: string;
  live: boolean;
  editedAt: Date;
  createdAt: Date;
};

const blogPostSchema = new Schema<IBlogPost>({
  title: { 
    type: String, 
    validate: {
      validator: async function(title: string) {
        const post: IBlogPost | null = await this.constructor.findOne({ title });
        if (post) {
          if (post._id === this._id) return true;
          return false;
        } else {
          return true;
        }
      },
      message: () => "The choses title is in use. Titles must be unique"
    },
    required: true 
  },
  author: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true, default: "informational" },
  keywords: { type: [ String ], required: false, default: [] },
  slug: { type: String },
  live: { type: Boolean, required: true, default: false },
  editedAt: { type: Date, required: true, default: new Date(Date.now()) },
  createdAt: { type: Date, required: true, default: new Date(Date.now()) }
});

blogPostSchema.pre("save", async function (next: NextFunction) {
  const slug = this.title.toLowerCase().split(" ").join("_");
  this.slug = slug;
  next();
})
export default mongoose.model<IBlogPost>("BlogPost", blogPostSchema);