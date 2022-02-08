
export const verifyUserToken = async (JWTToken: string): Promise<boolean> => {
  // if (!JWTToken) return false;

  const url = process.env.NODE_ENV === "production" ? process.env.PRODUCTION_URL : process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const opts: RequestInit = {
    method: "GET",
    headers: {
      "Authorization": JWTToken
    }
  }
  console.log(12)
  try {
    const { status, statusText } = await fetch(`${url}/api/verify_user`, opts);
    return status === 200 ? true : false ;
  } catch (error) {
    throw error;
  }
};