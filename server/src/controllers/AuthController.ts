import type { Request, Response, CookieOptions } from "express";
import type { IUser } from "../models/User";
import type { LoginResponse, ErrorResponse } from "../_types/auth/authTypes";
import { issueJWT } from "./PassportController";


export default class AuthController {
  login = async (req: Request, res: Response<LoginResponse | ErrorResponse>): Promise<Response> => {
    const user = req.user as IUser;
    // 
    if (!user) {
      return await this.sendLoginErrorRes(res)
    }
    const { token, expires } = issueJWT(user);
    const { _id, email, firstName, lastName } = user;
    //
    const domain: string = process.env.NODE_ENV === "production" ? process.env.PROD_DOMAIN : null;
    const cookieOpts: CookieOptions = { maxAge: 3600000, httpOnly: true, domain, signed: true };
    //
    return (
      res
        .cookie("JWTToken", token, cookieOpts)
        .status(200)
        .json({
          responseMsg: "Logged in",
          success: true,
          userData: { _id, email, firstName, lastName  },
          jwtToken: {
            token, expires
          }
        })
    );
  } 
  logout = async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({ responseMsg: "Logged out" });
  }

  private async sendLoginErrorRes(res: Response<ErrorResponse>, opts?: { status?: number; responseMsg?: string; error?: any; errorMessages?: string[] }): Promise<Response> {
    // set defaults //
    const status = (opts && opts.status) ? opts.status : 500;
    const responseMsg = (opts && opts.responseMsg) ? opts.responseMsg : "Auth Error";
    const error = (opts && opts.error) ? opts.error : new Error("Authorization Error");
    const errorMessages = (opts && opts.errorMessages) ? opts.errorMessages : ["Something went wrong. Try again."];

    return res.status(status).json({ responseMsg, error, errorMessages });
     
  }
};
