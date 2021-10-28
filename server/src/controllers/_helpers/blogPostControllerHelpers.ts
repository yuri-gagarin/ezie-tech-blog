import { Types } from "mongoose";
// models //
import Admin from "@/server/src/models/Admin";
import User from "@/server/src/models/User";
import BlogPost from "@/server/src/models/BlogPost";
// types //
import type { Request, Response, NextFunction } from "express";
import type { IAdmin } from "../../models/Admin";
import type { IUser } from "../../models/User";
import type { IBlogPost } from "../../models/BlogPost";
import type { BlogPostErrRes } from "../../_types/blog_posts/blogPostTypes";
// general helpers //
import { respondWithNotAllowedError, respondWithNoModelIdError } from "./generalHelpers";


export const verifyUserModelAndPostId = async (req: Request, res: Response<BlogPostErrRes>, next: NextFunction): Promise<any> => {
  const user = req.user as IUser | IAdmin;
  const { post_id } = req.params;
  if (!post_id) respondWithNoModelIdError(res, [ "Could not resolve Blog Post id" ]);
  //
  if (post_id &&! Types.ObjectId.isValid(post_id)) {
    return respondWithNoModelIdError(res, [ "Invalid type for Blog Post id" ]);
  }
  //
  if (!user) respondWithNotAllowedError(res, [ "Could not resolve current User" ]);
  // all is fine //
  return next();
};

export const verifyUserLevel = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const user = req.user as (IAdmin | IUser);
  if (user instanceof Admin) {
    // admin can create, edit, delete //
    return next();
  } else if (user instanceof User) {
    if (user.userType === "CONTRIBUTOR") {
      // contributor can CREATE, EDIT DELETE //
      return next();
    } else {
      return respondWithNotAllowedError(res, [ "This action is not allowed" ]);
    }
  } else {
    // should not be here but just in case ... //
    return respondWithNotAllowedError(res, [ "This action is not allowed" ]);
  }
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