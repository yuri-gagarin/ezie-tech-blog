import Admin from "../../models/Admin";
import User from "../../models/User";
//
import { respondWithNoModelIdError, respondWithNotAllowedError } from "./generalHelpers";
// types //
import type { UpdateUserPassReqData } from "../../_types/users/userTypes";
import type { Request, Response, NextFunction } from "express";
import type { IAdmin } from "../../models/Admin";
import type { IUser } from "../../models/User";

export const verifyUsersModelAccess = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.params;
  const currentUser = req.user as IAdmin | IUser;
  if (!user_id) {
    return respondWithNoModelIdError(res, [ "Could not resolve a User id" ]);
  }
  if (currentUser) {
    if (currentUser instanceof Admin) {
      // user is an Admin, has access to all User models //
      return next();
    } else if (currentUser instanceof User) {
      if (currentUser._id.equals(user_id)) {
        // users model, can edit //
        return next();
      } else {
        return respondWithNotAllowedError(res, [ "Not allowed to access User data not belonging to you" ]);
      }
    } else {
      return respondWithNotAllowedError(res, [ "Could not resolve logged in Users data" ]);
    }
  } else {
    return respondWithNotAllowedError(res, [ "Could not resolve logged in Users data" ]);
  }
};

export const userPasswordChangeMiddleware = async (req: Request<{}, {}, UpdateUserPassReqData>, res: Response, next: NextFunction) => {
  const { oldPassword, newPassword, userId } = req.body;
  const currentUser = req.user as IAdmin | IUser;
  if (currentUser) {
    if (currentUser instanceof Admin) {
      // admin should be able to set a new password w/o old, only <newPassword> and <userId> fields are needed //
      const { } = val
    } else {
      // regular user //
    }
  } else {
    return respondWithNotAllowedError(res, [ "Could not resolve logged in Users data" ]);
  }
  // validate data sent in first //
}
