import { GeneralClientError } from "@/components/_helpers/errorHelpers";
import { AxiosError } from "axios";
import { CreateBlogPostRes } from "../_types/blog_posts/dataTypes";
type AnyObj = {
  [key: string]: any;
}
export const checkEmptyObjVals = (obj: AnyObj): boolean => {
  const keys: string[] = Object.keys(obj);
  if (keys.length > 0) {
    for (const key of keys) {
      if (!obj[key]) {
        continue;
      } else if (Array.isArray(obj[key]) && obj[key].length > 0) {
        return false;
      } else if(typeof obj[key] === "object" && obj[key] != null) {
        checkEmptyObjVals(obj[key]);
      } else {
        return false;
      }
    }
    return true;
  } else {
    return true;
  }
};

export const processAxiosError = (error: any): { status: number; responseMsg: string; error: Error; errorMessages: string[] } => {
  if (error.isAxiosError && error.response) {
    const { response } = error as AxiosError;
    console.log(error)
    const { status } = response;
    const { responseMsg, error: _error, errorMessages  } = response.data as CreateBlogPostRes;
    return {
      status, responseMsg, errorMessages, error: _error
    };
  } else if (error instanceof GeneralClientError) {
    return {
      status: 400,
      responseMsg: "Client Error",
      error,
      errorMessages: error.errorMessages
    };
  } else if (error && error.response) {
    if (error.response.responseMsg && error.response.error && error.response.errorMessages) {
      const { response } = error as AxiosError<{ responseMsg: string; error: Error, errorMessages: string[] }>;
      const { status, data } = response;
      return { status, ...data };
    } else {
      const { status = 500, data } = error.response;
      return { 
        status, 
        responseMsg: data.responseMsg ? data.responseMsg : "An error occured",
        error: data.error ? data.error : new Error("Unknown Error"),
        errorMessages: [ "An error occured, we are working on it" ]
      };
    }
  } else {
    return {
      status: 500,
      responseMsg: "Error",
      error: new Error("Error! Weird!"),
      errorMessages: [ "An error occured, we are working on it" ]
    };
  }
};
