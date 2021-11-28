import axios from 'axios';
import type { GetServerSidePropsResult } from "next";

export const verifyAdminToken = async (JWTToken: string): Promise<boolean> => {
  if (!JWTToken) return false;

  const url = process.env.NODE_ENV === "production" ? process.env.PRODUCTION_URL : process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const opts: RequestInit = {
    method: "GET",
    headers: {
      "Authorization": JWTToken
    }
  }
  const opts2: RequestInit = {
    method: "GET",
    headers: {
      "Authorization": JWTToken
    }
  }
  try {
    const res = await fetch(`${url}/api/verify_admin`, opts);
    return res.status === 200 ? true : false ;
  } catch (error) {
    throw error;
  }
};