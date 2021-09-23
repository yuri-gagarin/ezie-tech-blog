import { Types } from "mongoose";
import type { Request, Response, NextFunction, CookieOptions } from "express";

export const checkAndSetUniqueUserId = (req: Request, res: Response, next: NextFunction): void => {
  const UNIQUE_USER_ID = "uniqueUserId";
  if (req.signedCookies[UNIQUE_USER_ID]) {
    next();
  } else {
    const userId = new Types.ObjectId().toHexString();
    const domain: string = process.env.NODE_ENV === "production" ? process.env.PROD_DOMAIN : null;
    const cookieOptions: CookieOptions = {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      signed: true,
      domain
    };
    res.cookie(UNIQUE_USER_ID, userId, cookieOptions);
    next();
  }
};
