import { validateProfileDeleteData } from "./validationHelpers";
import { InvalidDataError } from "./errorHelperts";
import { respondWithNotAllowedError, respondWithNoUserError, respondWithWrongInputError } from "./generalHelpers";
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

export const verifyUserProfileAccess = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const user = req.user as IAdmin | IUser;
  try {
    if (!user) return respondWithNoUserError(res, { responseMsg: "Logged in user could not be resolved" });
    if (user.email !== email) {
      return respondWithNotAllowedError(res, [ "Not allowed to change this profile" ]);
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
}