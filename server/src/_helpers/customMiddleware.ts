import { Types } from "mongoose";
import RssReadingList from "../models/RssReadingList";
// type imports //
import type { Request, Response, NextFunction, CookieOptions } from "express";
import type { GenUserData } from "@/redux/_types/users/dataTypes";

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

export const rssCorsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.url.includes("/api/rss")) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  }
};

export const validateUserReadingListAccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = req.user as GenUserData;

  try {
    next()
  } catch (error) {

  }
}

