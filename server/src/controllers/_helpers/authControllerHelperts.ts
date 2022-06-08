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

//
export const verifyUserProfileAccessAndData = async (req: Request, res: Response, next: NextFunction) => {
  const { currentPassword, userId } = req.body as { currentPassword?: string; userId?: string; };
  const loggedInUser = req.user as IAdmin | IUser;
  try {
    if (loggedInUser && loggedInUser instanceof Admin) {
      // for now Admin can't acccess this route //
      // later as we have inactive users then admin will have access to the route //
      return respondWithNotAllowedError(res, ["Admin has no access to /api/delete_user_profile route"], 403);
    } else if (loggedInUser && loggedInUser instanceof User) {
      // <currentPassword> and <userId> fields must be defined //
      const { valid, errorMessages } = validateProfileDeleteData({ userId, currentPassword });
      if (!valid) return respondWithWrongInputError(res, { customMessages: errorMessages });
      // check that <userId> field matches current user and that password is correct //
      if (loggedInUser._id.equals(userId)) {
        const validPass: boolean = await loggedInUser.validPassword(currentPassword);
        if (validPass) {
          // all is good, proceed to delete profile action and logout //
          return next();
        } else {
          return respondWithNotAllowedError(res, [ "Invalid password entered" ], 403);
        }
      } else {  
        return respondWithNotAllowedError(res, [ "Action only allowed on own profile" ], 403);
      }
    } else {
      // somethings wrong with login //
      return respondWithNoUserError(res, { errorMessages: [ "Please logout and login again" ] });
    }
  } catch (error) {
    return res.status(500).json({
      responseMsg: "Server Error",
      error,
      errorMessages: [ "A server error on our end" ]
    });
  }
}