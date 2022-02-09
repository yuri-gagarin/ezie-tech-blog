import { decode } from "jsonwebtoken";
import Admin from "@/server/src/models/Admin";
// type imports //
import type { IAdmin } from "@/server/src/models/Admin";
import type { JwtPayload } from "jsonwebtoken";

export const verifyAdminToken = async (JWTToken: string | undefined | null): Promise<boolean> => {
  if (!JWTToken) return false;

  try {
     // split of the 'Bearer' string value //
     const [ _, tokenString ] = JWTToken.split(" "); 
     const JWTPayload: JwtPayload | null = decode(tokenString) as JwtPayload; 
     // false return if invalid token value //
     if (!JWTPayload) return false; 
     //
    const { sub } = JWTPayload;
    const foundAdmin: IAdmin | null = await Admin.findById(sub);
    //
    return foundAdmin ? true : false;  
  } catch (error) {
    throw error;
  }
};