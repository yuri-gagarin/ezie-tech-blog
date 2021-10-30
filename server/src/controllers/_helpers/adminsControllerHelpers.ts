import Admin from "../../models/Admin";
//
import { respondWithNoModelIdError, respondWithNotAllowedError } from "./generalHelpers";
// types //
import type { Request, Response, NextFunction } from "express";
import type { IAdmin } from "../../models/Admin";

export const verifyAdminModelPresent = (userModel: any): boolean => {
  return (userModel && userModel instanceof Admin);
}
export const verifyOwnerLevelAccess = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IAdmin;
  return verifyAdminModelPresent(user) && user.role === "owner" ? next() : respondWithNotAllowedError(res, [ "Insufficcient access level for action" ]);
};

export const verifyAdminModelAccess = (req: Request, res: Response, next: NextFunction) => {
  const { admin_id } = req.params;
  const user = req.user as IAdmin;
  if (verifyAdminModelPresent(user) && user.role === "owner") {
    // can edit all //
    return admin_id ? next() : respondWithNoModelIdError(res, [ "Can't resolve Admin model id" ])
  } else if (verifyAdminModelPresent(user) && user.role === "admin") {
    // regular admins admins can only edit their own models //
    if (admin_id) {
      return user._id.equals(admin_id) ? next() : respondWithNotAllowedError(res, [ "Not allowed to edit other Admins" ]);
    } else {
      return respondWithNoModelIdError(res, [ "Could not resolve Admin model id" ]);
    } 
  } else {
    return respondWithNotAllowedError(res, [ "Action is not allowed" ]);
  }
};

// only owner level admin can change <Admin.role> or <Admin.confirmed> //
export const verifyAdminRoleOrConfirmationChange = (req: Request, res: Response, next: NextFunction) => {
  const { role, confirmed } = req.query;
  const user = req.user as IAdmin
  if (role || confirmed) {
    return (verifyAdminModelPresent(user) && user.role === "owner") ? next() : respondWithNotAllowedError(res, [ "Insufficcient access level for action" ]);
  } else {
    // no role or confirmation changes //
    return next();
  }
}