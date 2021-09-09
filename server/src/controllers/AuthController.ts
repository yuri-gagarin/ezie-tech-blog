import type { Request, Response } from "express";
import { IUser } from "../models/User";
import { issueJWT } from "./PassportController";


export default class AuthController {
  login(req: Request, res: Response): Response {
    const user = req.user as IUser;
    const { token, expires } = issueJWT(user);

    return res.status(200).json({
      responseMsg: "Logged in",
      success: true,
      jwtToken: {
        token, expires
      }
    });
  } 
  logout(req: Request, res: Response): Response {
    return res.status(200).json({ responseMsg: "Logged out" });
  }
};
