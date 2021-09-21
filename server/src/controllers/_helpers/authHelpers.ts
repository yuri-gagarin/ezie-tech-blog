import Admin from "../../models/Admin";
import { PassportContInstance } from "../../server";
// types //
import type { Request, Response, NextFunction } from "express";
import type { IAdmin } from "../../models/Admin";
import type { IUser } from "../../models/User";
import type { ErrorResponse } from "../../_types/auth/authTypes";

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
}
