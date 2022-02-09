import { decode } from "jsonwebtoken";
import User from "@/server/src/models/User";
// type imports //
import type { IUser } from "@/server/src/models/User";
import type { JwtPayload } from "jsonwebtoken";

export const verifyUserToken = async (JWTToken: string | undefined | null): Promise<boolean> => {
  if (!JWTToken) return false;

  // const url = process.env.NODE_ENV === "production" ? process.env.PRODUCTION_URL : process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  try {
    // const { status, statusText } = await fetch(`${url}/api/verify_user`, opts);
    // split of the 'Bearer' string value //
    const [ _, tokenString ] = JWTToken.split(" "); 
    const JWTPayload: JwtPayload | null = decode(tokenString) as JwtPayload; 
    // false return if invalid token value //
    if (!JWTPayload) return false; 
    //
    const { sub, iat } = JWTPayload;
    console.log(iat);
    const foundUser: IUser | null = await User.findById(sub);
    //
    return foundUser ? true : false;  
  } catch (error) {
    throw error;
  }
};