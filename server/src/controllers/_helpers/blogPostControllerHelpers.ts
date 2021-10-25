import { Types } from "mongoose";
// models //
import BlogPost from "../../models/BlogPost";
// types //
import type { Request, Response, NextFunction } from "express";
import type { IAdmin } from "../../models/Admin";
import type { IUser } from "../../models/User";
// 
import type { IBlogPost } from "../../models/BlogPost";
import type { BlogPostErrRes } from "../../_types/blog_posts/blogPostTypes";


export const verifyUserModelAndPostId = async (req: Request, res: Response<BlogPostErrRes>, next: NextFunction): Promise<any> => {
  const user = req.user as IUser | IAdmin;
  const { post_id } = req.params;
  if (!post_id) {
    return res.status(400).json({
      responseMsg: "Input error",
      error: new Error("Client error"),
      errorMessages: [ "Could not resolve model id" ]
    });
  }
  if (post_id &&! Types.ObjectId.isValid(post_id)) {
    return res.status(400).json({
      responseMsg: "Input error",
      error: new Error("Client error"),
      errorMessages: [ "Invalid model id type" ]
    });
  }
  if (!user) {
    return res.status(401).json({
      responseMsg: "Not allowed",
      error: new Error("User error"),
      errorMessages: [ "Could not resolve user" ]
    });
  }
  return next();
};

export const verifyBlogPostModelAccess = async (req: Request, res: Response<BlogPostErrRes>, next: NextFunction): Promise<Response| void> => {
  const user = req.user as (IAdmin | IUser);
  const { _id: userId } = user;
  const { post_id } = req.params;

  
  if ((user as IAdmin).role ) {
    // user is admin, can access //
    if((user as IAdmin).role === "admin" || (user as IAdmin).role === "owner") {
      return next();
    } else {
      return res.status(401).json({
        responseMsg: "Edit not allowed",
        error: new Error("Not Allowed Error"),
        errorMessages: [ "Not allowed to edit Blog Post not belonging to this user" ]
      });
    }
  } else {
    try {
      const blogPost: IBlogPost | null = await BlogPost.findById(post_id);
      if (blogPost) {
        if (blogPost.author.authorId.equals(userId)) {
          return next();
        } else {
          return res.status(401).json({
            responseMsg: "Edit not allowed",
            error: new Error("Not Allowed Error"),
            errorMessages: [ "Not allowed to edit Blog Post not belonging to this user" ]
          });
        }
      } else {
        return res.status(404).json({
          responseMsg: "Blog post not found",
          error: new Error("Not Found Error"),
          errorMessages: [ "Queried Blog Post model not found" ]
        });
      }
    } catch (error) {
      return res.status(500).json({
        responseMsg: "Server error",
        error: new Error("Database error"),
        errorMessages: [ "Something went wrong on our end" ]
      });
    }
  }
};


// error instances //
export class BlogPostNotAllowedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Blog Post Not Allowed Error";
  };
};