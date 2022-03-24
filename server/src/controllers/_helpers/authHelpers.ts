import Admin from "../../models/Admin";
import { PassportContInstance } from "../../server";
import { StrategyNames } from "../PassportController"; 
// helpers //
import { AuthNotFoundError, AuthNotLoggedInError } from "./errorHelperts";
// types //
import type { Request, Response, NextFunction, CookieOptions } from "express";
import type { IAdmin } from "../../models/Admin";
import type { IUser } from "../../models/User";
import type { ErrorResponse } from "../../_types/auth/authTypes";

export const passportLoginMiddleware = (req: Request, res: Response, next: NextFunction) => {
  PassportContInstance.authenticate(StrategyNames.LoginAuthStrategy, { session: false }, (err, user: IAdmin | IUser | null, info) => {
    if (err && err instanceof AuthNotFoundError) {
      return res.status(400).json({
        responseMsg: "Invalid Login",
        error: err,
        errorMessages: err.getErrorMessages
      });
    }
    if(!user) {
      console.log(16)
      return res.status(400).json({
        responseMsg: "Invalid login",
        error: err ? err : new Error("Login Error"),
        errorMessages: [ "Incorrect email or password" ]
      });
    } 
    req.user = user;
    return next();
  })(req, res, next);
};

export const passportGeneralAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  PassportContInstance.authenticate(StrategyNames.AuthStrategy, { session: false }, (err, user: IAdmin | IUser | null, info) => {
    console.log(36)
    console.log(err)
    console.log(user)
    if (err) {
      if (err instanceof AuthNotLoggedInError) {
        return res.status(401).json({
          responseMsg: "An error occurred ",
          error: err,
          errorMessages: err.getErrorMessages
        });
      } else {
        return res.status(500).json({
          responseMsg: "An error occurred ",
          error: err,
          errorMessages: [ err.message ]
        })
      }
    }

    if(!user) {
      return res.status(401).json({
        responseMsg: "Not Found",
        error: err ? err : new Error("Login Error"),
        errorMessages: [ "User found" ]
      });
    } 
    req.user = user;
    return next();
  })(req, res, next);
}

/**
 * Checks for a login, assigns a user object if logged in otherwise req.user === null. Does NOT protect an API route 
 */
export const checkforLogin = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    // process //
    PassportContInstance.authenticate(StrategyNames.CheckUserStrategy, { session: false }, (err, user: IAdmin | IUser | null) => {
      if (err) {
        next(err);
      }
      if (!user) {
        req.user = null;
        next();
      } else {
        req.user = user;
        next();
      }
    })(req, res, next);
  } else {
    req.user = null;
    next();
  }
};

/*

*/
export const verifyAdmin = async (req: Request, res: Response<ErrorResponse>, next: NextFunction): Promise<Response<ErrorResponse>> => {
  const user: IAdmin = req.user as IAdmin;
  if (!user) {
    return res.status(401).json({
      responseMsg: "Not allowed",
      error: new Error("Auth error"),
      errorMessages: ["Missing user data"]
    });
  } else {
    const { _id: adminId } = user;
    const adminData: IAdmin | null = await Admin.findById(adminId).exec();
    if (!adminData) {
      return res.status(401).json({
        responseMsg: "Not allowed",
        error: new Error("Permission error"),
        errorMessages: [ "Your account type does not allow this action" ]
      })
    } else {
      next();
    }
  }
};

export const setLogoutCookieOpts = (): CookieOptions => {
  const domain: string = process.env.NODE_ENV === "production" ? process.env.PROD_DOMAIN : null;
  return { maxAge: 0, httpOnly: true, domain, signed: true, sameSite: "strict" };
};