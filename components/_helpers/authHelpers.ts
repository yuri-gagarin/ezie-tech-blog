// 
import { verifyAdminToken } from "./adminComponentHelpers";
//
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";

/*
const token = context.req["signedCookies"].JWTToken;
  let validAdmin: boolean;
  try {
    validAdmin = await verifyAdminToken(token);
  } catch (error) {
    console.log(error);
    validAdmin = false;
  }

  if (!validAdmin) {
    return {
      props: { }
    };
  } else {
    return {
      redirect: {
        destination: "/login",
        statusCode: 301,
      },
      props: {
        errorMessages: [ "Not Logged in "] 
      }
    };
  }

  */

export const requireAdminAuthentication = (getServerSideProps: any) => {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
    let validAdmin: boolean = false;
    //
    const { req } = context;
    const token = req["signedCookies"].JWTToken;

    console.log("Valid token: " + token)
    try {
      validAdmin = await verifyAdminToken(token);
    } catch (error) {
      console.log(error);
      validAdmin = false;
    }

    console.log("Valid admin: "  + validAdmin)

    if (!validAdmin) {
      return {
        redirect: {
          destination: "/login",
          statusCode: 301
        }
      }
    }

    return await getServerSideProps(context);
  } 
  
};