import Admin from "../../models/Admin";
import User from "../../models/User";
//
import { respondWithNoModelIdError, respondWithNotAllowedError, respondWithWrongInputError } from "./generalHelpers";
// types //
import type { UpdateUserPassReqData } from "../../_types/users/userTypes";
import type { Request, Response, NextFunction } from "express";
import type { IAdmin } from "../../models/Admin";
import type { IUser } from "../../models/User";
import { validatePasswordChangeData } from "./validationHelpers";

export const verifyUsersModelAccess = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.params || req.query as { userId?: string; };
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
  const { oldPassword, newPassword, confirmNewPassword, userId } = req.body;
  const currentUser = req.user as IAdmin | IUser;
  if (currentUser) {
    if (currentUser instanceof Admin) {
      // admin should be able to set a new password w/o old, only <newPassword> <confirmNewPassword> and <userId> fields are needed //
      const { valid, errorMessages } = validatePasswordChangeData({ newPassword, confirmNewPassword });
      if (!valid) return respondWithWrongInputError(res, { responseMsg: "Invalid input", customMessages: errorMessages });
      next();
    } else {
      // regular user //
      // can only edit password on its own model //
      // can only edit password if <newPassword> <confirmNewPassword> <oldPassword> and <userId> fields are present and <oldPassword> is correct //
      const { _id: loggedInUserId } = currentUser;
      const { valid, errorMessages } = validatePasswordChangeData({ newPassword, confirmNewPassword, oldPassword}, { oldPassRequired: true });
      if (!valid) return respondWithWrongInputError(res, { responseMsg: "Invalid input", customMessages: errorMessages });
      // check logged in users credentails to change the password //
      const foundUser: IUser | null = await User.findOne({ _id: loggedInUserId }).exec();
      if (foundUser) {
        // validate correct user password //
        const validPassword: boolean = await foundUser.validPassword(oldPassword);
        if (validPassword) {
          // user can change the password, next() // 
          next();
        } else {
          const customMessages: string[] = [ "Curent password is incorrect" ];
          return respondWithNotAllowedError(res, customMessages, 403);
        }
      } else {
        const customMessages: string[] = [ "Cannot resolve current user", "Please re login" ];
        return respondWithNotAllowedError(res, customMessages, 401);
      }
    }
  } else {
    return respondWithNotAllowedError(res, [ "Could not resolve logged in Users data" ]);
  }
  // validate data sent in first //
}
