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
    return respondWithNoModelIdError(res, [ "Could not resolve User login" ]);
  }
};