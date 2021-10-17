import mongoose, { Schema } from "mongoose";
// types //
import type { Document, Model, Query } from "mongoose";
import type { NextFunction } from "express";
import type { IAdmin } from "./Admin";
import type { IUser } from "./User";

export type LikeData = {
  userId: mongoose.Types.ObjectId;
}
export interface IBlogPost extends Document  {
  title: string;
  author: {
    name: string;
    authorId: mongoose.Types.ObjectId;
  };
  content: string;
  category: "informational" | "beginner" | "intermediate" | "advanced";
  keywords: string[];
  slug: string;
  likes: mongoose.Types.ObjectId[];
  numOflikes: number;
  published: boolean;
  editedAt: Date;
  createdAt: Date;
};

interface IBlogPostQueryHelpers {
  byCategory(category: "informational" | "beginner" | "intermediate" | "advanced" | "all"): Query<any, Document<IBlogPost>> & IBlogPostQueryHelpers;
  byPublishedStatus(published: "published" | "unpublished" | "all"): Query<any, Document<IBlogPost>> & IBlogPostQueryHelpers;
} 

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
  author: { 
    authorId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, default: "" }
  },
  content: { type: String, required: true },
  category: { type: String, required: true, default: "informational" },
  keywords: { type: [ String ], required: false, default: [] },
  likes: [ Schema.Types.ObjectId ],
  numOflikes: { type: Number, required: false, default: 0 },
  slug: { type: String },
  published: { type: Boolean, default: false },
  editedAt: { type: Date, required: true, default: new Date(Date.now()) },
  createdAt: { type: Date, required: true, default: new Date(Date.now()) }
});

blogPostSchema.pre("save", async function (next: NextFunction) {
  const slug = this.title.toLowerCase().split(" ").join("_");
  this.slug = slug;
  next();
});

blogPostSchema.query.createdByUser = function(user: IUser | IAdmin): Query<any, Document<IBlogPost>> & IBlogPostQueryHelpers {
  if (user.hasOwnProperty("role")) {
    // is admin can see all //
    return this;
  } else {
    return this.find({ author: { userId: user._id } });
  }
};

blogPostSchema.query.byCategory = function(category: "informational" | "beginner" | "intermediate" | "advanced" | "all"): Query<any, Document<IBlogPost>> & IBlogPostQueryHelpers {
  if (category === "all") {
    return this.find({});
  } else if (category === "informational" || category === "beginner" || category === "intermediate" || category === "advanced") {
    return this.find({ category });
  } else {
    return this.find({});
  }
};

blogPostSchema.query.byPublishedStatus = function(publishQuery: "published" | "unpublished" | "all"): Query<any, Document<IBlogPost>> & IBlogPostQueryHelpers {
  if (publishQuery === "published") {
    return this.find({ published: true });
  } else if (publishQuery === "unpublished") {
    return this.find({ published: false });
  } else {
    return this;
  }
};

export default mongoose.model<IBlogPost, Model<IBlogPost, IBlogPostQueryHelpers>>("BlogPost", blogPostSchema);