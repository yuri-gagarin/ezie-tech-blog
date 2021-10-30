import Admin from "../../models/Admin";
//
import { respondWithNoModelIdError, respondWithNotAllowedError } from "./generalHelpers";
// types //
import type { Request, Response, NextFunction } from "express";
import type { IAdmin } from "../../models/Admin";
import type { IUser } from "../../models/User";

export const verifyOwnerLevelAccess = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IAdmin | IUser;
  if (user) {
    if (user instanceof Admin) {
      if (user.role === "owner") {
        return next();
      } else {
        return respondWithNotAllowedError(res, [ "Insufficcient access level for action" ]);
      }
    } else {
      return respondWithNotAllowedError(res, [ "Insufficcient access level for action" ]);
    }
  } else {
    return respondWithNotAllowedError(res, [ "Could not resolve User login" ]);
  }
};

export const verifyAdminModelAccess = (req: Request, res: Response, next: NextFunction) => {
  const { admin_id } = req.params;
  const user = req.user as IAdmin;
  if (user) {
    if (user instanceof Admin && user.role === "owner") {
      // can edit all //
      return admin_id ? next() : respondWithNoModelIdError(res, [ "Can't resolve Admin model id" ])
    } else if (user instanceof Admin && user.role === "admin") {
      // regular admins admins can only edit their own models //
      if (admin_id) {
        return user._id.equals(admin_id) ? next() : respondWithNotAllowedError(res, [ "Not allowed to edit other Admins" ]);
      }
    } else {
      return respondWithNotAllowedError(res, [ "Insufficcient access level for action" ]);
    }
  } else {
    return respondWithNotAllowedError(res, [ "Could not resolve User login" ]);
  }
}