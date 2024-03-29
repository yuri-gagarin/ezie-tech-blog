import * as firebaseAdmin from "firebase-admin";
import { decode } from "jsonwebtoken";
// models //
import User from "../models/User";
import Admin from "../models/Admin";
// additional for JWT //
import { issueJWT } from "./PassportController";
// types 
import type { Request, Response, CookieOptions } from "express";
import type { JwtPayload } from "jsonwebtoken";
import type { IAdmin } from "../models/Admin";
import type { IUser } from "../models/User";
import type { RegisterReqBody, DeleteProfileReqBody, LoginResponse, RegisterResponse, DeleteAdminProfileRes, DeleteUserProfileRes, ErrorResponse } from "../_types/auth/authTypes";
import type { AdminData } from "../_types/admins/adminTypes";
import type { UserData } from "../_types/users/userTypes";
// helpers //
import { validateRegistrationData, validateProfileDeleteData } from "./_helpers/validationHelpers";
import { trimRegistrationData } from "./_helpers/authControllerHelperts";
import { AuthNotFoundError, AuthWrongPassError, InvalidDataError } from "./_helpers/errorHelperts";

export enum LoginCookies {
  JWTToken = "JWTToken"
};


export default class AuthController {
  login = async (req: Request, res: Response<LoginResponse | ErrorResponse>): Promise<Response> => {
    const user = req.user as (IUser | IAdmin);
    // response variables depending on user or admin //
    let userData: AdminData | UserData;
    let isAdmin: boolean;
    let adminFirebaseAuth: { adminFirebaseToken: string; expires: number } | null;
    // 
    if (!user) return await this.sendErrorRes(res);
    // 
    try {
      const { token, expires } = issueJWT(user);
      //
      const domain: string = process.env.NODE_ENV === "production" ? process.env.PROD_DOMAIN : null;
      const cookieOpts: CookieOptions = { maxAge: 3600 * 1000 * 12, httpOnly: true, domain, signed: true, sameSite: "strict" };
      // generate firebase access token if isAdmin //
      if (this.checkUserLevel(user) === "ADMIN") {
        // generate an admin response //
        ({ userData, isAdmin, adminFirebaseAuth } = await this.setAdminLoginRes(user as IAdmin));
      } else {
        ({ userData, isAdmin, adminFirebaseAuth } = await this.setUserLoginRes(user as IUser));
      }
      return (
        res
          .cookie(LoginCookies.JWTToken, token, cookieOpts)
          .status(200)
          .json({
            responseMsg: "Logged in",
            success: true,
            isAdmin,
            userData,
            jwtToken: {
              token, expires
            },
            adminFirebaseAuth
          })
      );
    } catch (error) {
      return res.status(500).json({
        responseMsg: "Logged in", error, errorMessages: [ "Something went wrong on login" ]
      })
    }
  } 
  register = async (req: Request<any, any, RegisterReqBody>, res: Response<RegisterResponse | ErrorResponse>): Promise<Response> => {
    const { email, password, confirmPassword } = req.body;
    
    const { valid, errorMessages } = validateRegistrationData({ email, password, confirmPassword });
    if (!valid) return await this.sendErrorRes(res, { status: 400, error: new Error("User Input Error"), errorMessages });
    // validate unique email next //
    const { exists, message } = await this.validateUniqueEmail(email.trim());
    if (exists) return await this.sendErrorRes(res, { status: 400, error: new Error("User Input Error"), errorMessages: [ message ] });
    // assuming all is well ... //
    const trimmedData = trimRegistrationData({ email, password, confirmPassword });
    //
    const domain: string = process.env.NODE_ENV === "production" ? process.env.PROD_DOMAIN : null;
    const cookieOpts: CookieOptions = { maxAge: 3600000, httpOnly: true, domain, signed: true, sameSite: "strict" };

    try {
      const userData = await User.create({ email: trimmedData.email, password: trimmedData.password, confirmed: false, createdAt: new Date(), editedAt: new Date() });
      const { token, expires } = issueJWT(userData);
      return (
        res
        .status(200)
        .cookie(LoginCookies.JWTToken, token, cookieOpts)
        .json({
          responseMsg: "Registration success",
          userData: { 
            _id: userData._id, 
            email: userData.email, 
            firstName: userData.firstName, 
            confirmed: userData.confirmed,
            userType: userData.userType,
            lastName: userData.lastName, 
            editedAt: userData.editedAt,
            createdAt: userData.createdAt
          },
          isAdmin: false,
          jwtToken: {
            token, expires
          }
        })
      );
    } catch (error) {
      return await this.sendErrorRes(res, { error, errorMessages: [ "Oops something went seriously wrong..." ]});
    }
  }

  // correct middleware should run for login check //
  // data should be validated and email checked by midlleware //
  // current logged in user password and permissions should be checked by middleware as well //
  deleteUserProfile = async (req: Request<any, any, DeleteProfileReqBody>, res: Response<DeleteUserProfileRes>): Promise<Response<DeleteUserProfileRes>> => {
    const { userId } = req.body as { userId: string; };
    const user = req.user as IAdmin | IUser;
    try {     
      const isAdmin: boolean = user instanceof Admin;     
      // archive all users posts later ? //
      const deletedUser: IUser | null = await User.findOneAndDelete({ _id: userId }).exec();
      if (deletedUser) {
        // admin should stay logged in and get back the deleted user data //
        if (isAdmin) {
          return res.status(200).json({
            responseMsg: "User profile deleted", deletedUser
          })
        } else {
          // regular user should be logged out and have JWT token cookie deleted //
          const domain: string = process.env.NODE_ENV === "production" ? process.env.PROD_DOMAIN : null;
          const cookieOpts: CookieOptions = { maxAge: 0, httpOnly: true, domain, signed: true, sameSite: "strict" };
          return (
            res
              .status(200)
              .cookie(LoginCookies.JWTToken, "", cookieOpts)
              .json({ responseMsg: "Deleted profile and logged out" })
          );
        } 
      } else {
        const error = new AuthNotFoundError("Model Not Found", [ "User profile to delete was not found" ]);
        return this.sendErrorRes(res, { status: 404, error, errorMessages: error.getErrorMessages });
      }
    } catch (error) {
      return this.sendErrorRes(res, { status: 500, error, errorMessages: [ "A server error has occured" ] });
    }
  }

  // correct middleware should run for login check //
  // data should be validated and email checked by midlleware //
  // only admin level user should be able to delete admin profile, owner level admins should be able to delete other admins //
  deleteAdminProfile = async (req: Request<any, any, DeleteProfileReqBody>, res: Response<DeleteAdminProfileRes>): Promise<Response>  => {
    const { email: adminEmailProfToDelete } = req.body;
    try {
      const deletingOwn: boolean = adminEmailProfToDelete === (req.user as IAdmin).email
      const deletedAdmin = await Admin.findOneAndDelete({ email: adminEmailProfToDelete }).exec();
      if (deletedAdmin) {
        // archive all admins posts later ? //
        // 
        if (deletingOwn) {
          // needs to be logged out as well
          const domain: string = process.env.NODE_ENV === "production" ? process.env.PROD_DOMAIN : null;
          const cookieOpts: CookieOptions = { maxAge: 0, httpOnly: true, domain, signed: true, sameSite: "strict" };
          return (
            res
              .status(200)
              .cookie(LoginCookies.JWTToken, "", cookieOpts)
              .json({ responseMsg: "Deleted profile and logged out" })
          );
        } else {
          return res.status(200).json({
            responseMsg: "Deleted admin profile",
            deletedAdmin
          })
        }
      } else {
          const error = new AuthNotFoundError("Not Found", [ "Queried Admin profile to delete was not found" ]);
          return this.sendErrorRes(res, { status: 404, error, errorMessages: error.getErrorMessages });
        }
    } catch (error) {
      return this.sendErrorRes(res, { status: 500, error, errorMessages: [ "A server error has occured" ] });
    }
  }
  
  logout = async (req: Request, res: Response): Promise<Response> => {
    
    const domain: string = process.env.NODE_ENV === "production" ? process.env.PROD_DOMAIN : null;
    const cookieOpts: CookieOptions = { maxAge: 0, httpOnly: true, domain, signed: true, sameSite: "strict" };

    return (
      res
      .clearCookie(LoginCookies.JWTToken)
      .status(200)
      .json({ responseMsg: "Logged out" })
    );
  }

  uniqueEmail = async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.query as { email: string };
    if (!email) return await this.sendErrorRes(res, { status: 400, error: new Error("Invalid Input"), errorMessages: [ "No email provided" ] });
    try {
      console.log(email)
      const { exists, message } = await this.validateUniqueEmail(email);
      return res.status(200).json({ responseMsg: message, exists });
    } catch (error) {
      return await this.sendErrorRes(res, { status: 500, error, errorMessages: [ "Server error" ] });
    }
  }

  /*
  verifyAdmin = async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({ responseMsg: "All ok "});
  }

  verifyUser = async (req: Request, res: Response): Promise<Response> => {
    // if (!user_token) return this.sendErrorRes(res, { status: 400, responseMsg: "Could not resolve user token", error: new Error("Auth Error"), errorMessages: [ "Could not resolve user token"]  });
    const { authorization } = req.headers;
    try {
      const [ _, token ] = authorization ? authorization.split(" ") : [ null, null ];
      const tokenData: JwtPayload | string | null = decode(token);
      if (tokenData) {
        const { sub, exp } = tokenData as JwtPayload;
        // check exp ? //
        const user: IUser | null = await User.findById(sub);
        if (user) {
          return res.status(200).json({
            responseMsg: "Valid User"
          });
        } else {
          return await this.sendErrorRes(res, { status: 401, error: new Error("Auth Error"), errorMessages: [ "Invalid user" ] });
        }
      } else {
        return await this.sendErrorRes(res, { status: 401, error: new Error("Auth Error"), errorMessages: [ "Invalid user" ] });
      }
    } catch (error) {
      return await this.sendErrorRes(res, { status: 500, error, errorMessages: [ "Server error" ] });
    }
  }
  */

  // PRIVATE HELPERS //
  private async sendErrorRes(res: Response<ErrorResponse>, opts?: { status?: number; responseMsg?: string; error?: any; errorMessages?: string[] }): Promise<Response> {
    // set defaults //
    const status = (opts && opts.status) ? opts.status : 500;
    const responseMsg = (opts && opts.responseMsg) ? opts.responseMsg : "Auth Error";
    const error = (opts && opts.error) ? opts.error : new Error("Authorization Error");
    const errorMessages = (opts && opts.errorMessages) ? opts.errorMessages : ["Something went wrong. Try again."];

    return res.status(status).json({ responseMsg, error, errorMessages });
  }

  private async validateUniqueEmail(email: string): Promise<{ exists: boolean; message: string }> {
    try {
      const admin = await Admin.findOne({ email: email }).exec();
      if (admin) return { exists: true, message: "Email already exists" };
      else {
        const user = await User.findOne({ email: email }).exec();
        if (user) return { exists: true, message: "Email already exists" };
        else return { exists: false, message: "" };
      }
    } catch (error) {
      throw error;
    }
  }

  private checkUserLevel = (user: IAdmin | IUser): "ADMIN" | "USER" => {
    return (user instanceof Admin) ? "ADMIN" : "USER";
  }
  private setAdminLoginRes = async (user: IAdmin): Promise<{ userData: AdminData; isAdmin: boolean; adminFirebaseAuth: { adminFirebaseToken: string; expires: number; } }> => {
    try {
      const { _id, firstName, lastName, email, role, editedAt, createdAt } = user;
      const userData: AdminData = {
        _id, firstName, lastName, email, role, editedAt, createdAt
      };
      const adminFirebaseAuth = {
        adminFirebaseToken: await firebaseAdmin.auth().createCustomToken(_id.toHexString()),
        expires: Date.now() + (3600 * 1000) // this is firebase default - can change maybe ?? //
      };
      return { userData, isAdmin: true, adminFirebaseAuth };
    } catch (error) {
      throw error;
    }
  }
  private setUserLoginRes = async (user: IUser): Promise<{ userData: UserData; isAdmin: boolean; adminFirebaseAuth: null }> => {
    try {
      const { _id, firstName, lastName, email, userType, editedAt, createdAt } = user;
      const userData: UserData = {
        _id, firstName, lastName, email, userType, editedAt, createdAt 
      };
      return { userData, isAdmin: false, adminFirebaseAuth: null };
    } catch (error) {
      throw error;
    }
  }
}
