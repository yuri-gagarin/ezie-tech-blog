import Admin from "../../models/Admin";
import User from "../../models/User";
//
import { validateProfileDeleteData } from "./validationHelpers";
import { InvalidDataError } from "./errorHelperts";
import { respondWithNotAllowedError, respondWithNotFoundError, respondWithNoUserError, respondWithWrongInputError } from "./generalHelpers";
// type imports //
import type { Request, Response, NextFunction, CookieOptions } from "express";
import type { ErrorResponse } from "../../_types/auth/authTypes";
import type { IAdmin } from "../../models/Admin";
import type { IUser} from "../../models/User";

export const trimRegistrationData = ({ email, password, confirmPassword }: { email: string; password: string; confirmPassword: string }) => {
  email = email.trim();
  password = password.trim();
  return {
    email, password 
  };
};

export const userProfileDeleteDataMiddleware = async (req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const { valid, errorMessages } = validateProfileDeleteData({ email, password });
    if (!valid) {
      const error = new InvalidDataError("Invalid User Input", errorMessages);
      return respondWithWrongInputError(res, { responseMsg: error.message, error, customMessages: error.getErrorMessages });
    } else {
      next();
    }
  } catch (error) {
    return res.status(500).json({
      responseMsg: "Server Error",
      error,
      errorMessages: [ "A server error on our end" ]
    });
  }
};

export const verifyAdminProfileAccess = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as { email: string; password: string; };
  const loggedInAdmin = req.user as IAdmin;

  try {
    if (!loggedInAdmin) {
      respondWithNoUserError(res, { responseMsg: "Logged in user could not be resolved" });
    }
    // validate password //
    const validAdminPassConfirm: boolean = await loggedInAdmin.validPassword(password);
    if (!validAdminPassConfirm) {
      return respondWithNotAllowedError(res, [ "Your account password is invalid" ]);
    }

    if (loggedInAdmin.role === "owner") {
      // owner level admin should be able to delete all profiles except anothher owner level admin //
      const adminProfileToDelete: IAdmin | null =  await Admin.findOne({ email }).exec();
      if (adminProfileToDelete) {
        if (adminProfileToDelete.role === "owner") {
          const { email: loggedInAdminEmail } = loggedInAdmin;
          // owner level admin cannot delete other owner level admins //
          return loggedInAdminEmail === email ? next() : respondWithNotAllowedError(res, [ "Delete operation denied" ], 403);
        } else {
          // owner level admin can delete other admins //
          return next();
        }       
      } else {
        return respondWithNotFoundError(res, [ "Could not resolve admin profile to delete" ]);
      }
    } else {
      const { email: currentAdminEmail } = loggedInAdmin;
      if (currentAdminEmail === email) {
        next();
      } else {
        // admin cannot delete another admins profile //
        return respondWithNotAllowedError(res, [ "Not allowed to delete another admins profile" ], 403);
      }
    }
  } catch (error) {
    return res.status(500).json({
      responseMsg: "Server Error",
      error,
      errorMessages: [ "A server error on our end" ]
    });
  }
}
export const verifyUserProfileAccess = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const loggedInUser = req.user as IAdmin | IUser;
  try {
    if (!loggedInUser) {
      return respondWithNoUserError(res, { responseMsg: "Logged in user could not be resolved" });
    }
    const foundUser: IUser | null = await User.findOne({ email }).exec();
    if (!foundUser) {
      return respondWithNotFoundError(res, [ "User with the queried email was not found" ]);
    }
    // admin should be able to delete any user model //
    const validLoggedInUserPass = await loggedInUser.validPassword(password);
    if (!validLoggedInUserPass) {
      return respondWithNotAllowedError(res, [ "Your account password is invalid" ]);
    };
    if (loggedInUser instanceof Admin) {
      // admin can delete any regular user account //
      next();
    } else {
      // regular users can only delete their own accounts //
      if (loggedInUser.email !== email) {
        return respondWithNotAllowedError(res, [ "Not allowed to change this profile" ]);
      } else {
        next();
      }
    }
  } catch (error) {
    return res.status(500).json({
      responseMsg: "Server Error",
      error,
      errorMessages: [ "A server error on our end" ]
    });
  }
}