import type { Request, Response } from "express";
import { IUser } from "../models/User";
import { issueJWT } from "./PassportController";


export default class AuthController {
  login(req: Request, res: Response): Response {
    const user = req.user as IUser;
    const { token, expires } = issueJWT(user);
    const { _id, email, firstName, lastName } = user;
    return res.status(200).json({
      responseMsg: "Logged in",
      success: true,
      userData: { _id, email, firstName, lastName  },
      jwtToken: {
        token, expires
      }
    });
  } 
  logout(req: Request, res: Response): Response {
    return res.status(200).json({ responseMsg: "Logged out" });
  }
};
