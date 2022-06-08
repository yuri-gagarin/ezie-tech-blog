import bcrypt from "bcrypt";
// data models //
import Admin from "../../models/Admin";
import User from "../../models/User";
//
import { respondWithNoModelIdError, respondWithNotAllowedError, respondWithNoUserError, respondWithWrongInputError } from "./generalHelpers";
// types //
import type { UpdateUserPassReqData } from "../../_types/users/userTypes";
import type { Request, Response, NextFunction } from "express";
import type { IAdmin } from "../../models/Admin";
import type { IUser } from "../../models/User";
import { validatePasswordChangeData } from "./validationHelpers";

export const hashUserPassword = async (passwordString: string): Promise<string> => {
  const SALT_ROUNDS = 10
  try {
    const hashedPassword = await bcrypt.hash(passwordString, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

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

/*
export const verifyUserDeleteMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { currentPassword } = req.body as { currentPassword: string | undefined };
  const currentLoggedInUser = req.user as IAdmin | IUser;

  // admin does NOT need to enter a current password to delete a user //
  if (currentLoggedInUser && currentLoggedInUser instanceof Admin) {

  } else if (currentLoggedInUser && currentLoggedInUser instanceof User) {
    // need to verify presence of <currentPassword> field and a correct password // 
    const customMessages: string[] = [];
    if (currentPassword) {
      if (currentLoggedInUser.validPassword(currentPassword)) {
        next(); 
      } else {
        customMessages.push("Your password is invalid");
        return respondWithNotAllowedError(res, customMessages, 403);
      }
    } else {
      customMessages.push("Enter your password to confirm");
      return respondWithWrongInputError(res, { customMessages });
    }
  } else {
    // something is weirdly wrong, no current user object //
    return respondWithNoUserError(res);
  }
}
*/

export const userPasswordChangeMiddleware = async (req: Request<{}, {}, UpdateUserPassReqData>, res: Response, next: NextFunction) => {
  const { userId, passwordData } = req.body;
  const { oldPassword, newPassword, confirmNewPassword } = passwordData;
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
      // first ensure <req.body.userId> === <loggedInUserId>;
      if (userId !== loggedInUserId.toHexString()) {
        return respondWithNotAllowedError(res, [ "Not allowed to edit another profile" ], 403);
      }
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
