import User from "../models/User";
//
import { issueJWT } from "./PassportController";
// types 
import type { Request, Response, CookieOptions } from "express";
import type { IUser } from "../models/User";
import type { RegisterReqBody, LoginResponse, RegisterResponse, ErrorResponse } from "../_types/auth/authTypes";
// helpers //
import { validateRegistrationData } from "./_helpers/validationHelpers";

enum LoginCookies {
  JWTToken = "JWTToken"
};

export default class AuthController {
  login = async (req: Request, res: Response<LoginResponse | ErrorResponse>): Promise<Response> => {
    const user = req.user as IUser;
    // 
    if (!user) {
      return await this.sendErrorRes(res)
    }
    const { token, expires } = issueJWT(user);
    const { _id, email, firstName, lastName } = user;
    //
    const domain: string = process.env.NODE_ENV === "production" ? process.env.PROD_DOMAIN : null;
    const cookieOpts: CookieOptions = { maxAge: 3600000, httpOnly: true, domain, signed: true };
    //
    return (
      res
        .cookie(LoginCookies.JWTToken, token, cookieOpts)
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
    console.log(req.cookies);
    return res.status(200).json({ responseMsg: "Logged out" });
  }

  register = async (req: Request<any, any, RegisterReqBody>, res: Response<RegisterResponse | ErrorResponse>): Promise<Response> => {
    const { email, password, confirmPassword } = req.body;
    
    const { valid, errorMessages } = validateRegistrationData({ email, password, confirmPassword });
    if (!valid) return await this.sendErrorRes(res, { status: 400, error: new Error("User Input Error"), errorMessages });

    const domain: string = process.env.NODE_ENV === "production" ? process.env.PROD_DOMAIN : null;
    const cookieOpts: CookieOptions = { maxAge: 3600000, httpOnly: true, domain, signed: true };

    try {
      const userData = await User.create({ email, password, confirmed: false, createdAt: new Date(), editedAt: new Date() });
      const { token, expires } = issueJWT(userData);
      return (
        res
        .status(200)
        .cookie(LoginCookies.JWTToken, token)
        .json({
          responseMsg: "Registration success",
          userData: { _id: userData._id, email: userData.email, },
          jwtToken: {
            token, expires
          }
        })
      );
    } catch (error) {
      return await this.sendErrorRes(res, { error, errorMessages: [ "Oops something went seriously wrong..." ]});
    }
  }

  private async sendErrorRes(res: Response<ErrorResponse>, opts?: { status?: number; responseMsg?: string; error?: any; errorMessages?: string[] }): Promise<Response> {
    // set defaults //
    const status = (opts && opts.status) ? opts.status : 500;
    const responseMsg = (opts && opts.responseMsg) ? opts.responseMsg : "Auth Error";
    const error = (opts && opts.error) ? opts.error : new Error("Authorization Error");
    const errorMessages = (opts && opts.errorMessages) ? opts.errorMessages : ["Something went wrong. Try again."];

    return res.status(status).json({ responseMsg, error, errorMessages });
  }
  
};
