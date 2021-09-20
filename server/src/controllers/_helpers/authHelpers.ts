import type { Request, Response, NextFunction } from "express";
import type { IAdmin } from "../../models/Admin";
import type { IUser } from "../../models/User";
//
import { PassportContInstance } from "../../server";

export const passportLoginMiddleware = (req: Request, res: Response, next: NextFunction) => {
  PassportContInstance.authenticate("login", { session: false }, (err, user: IAdmin | IUser | null, info) => {
    if(err || !user) {
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
