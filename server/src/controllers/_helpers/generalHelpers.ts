import { Types } from "mongoose";
// type imports //
import type { NextFunction, Request, Response } from "express";
import type { ErrorResponse } from "../../_types/auth/authTypes";
import { AuthNotLoggedInError, AuthNotFoundError, InvalidDataError } from "./errorHelperts";

export const respondWithNotFoundError = (res: Response<ErrorResponse>, customMessages?: string[]) => {
  const error = new AuthNotFoundError("Auth Not Found Error", customMessages);
  return res.status(404).json({
    responseMsg: "Not Found Error",
    error,
    errorMessages: error.getErrorMessages
  });
};

export const respondWithNoModelIdError = (res: Response<ErrorResponse>, customMessages?: string[]) => {
  return res.status(400).json({
    responseMsg: "Input error",
    error: new Error("Client error"),
    errorMessages: customMessages ? customMessages : [ "Could not resolve model id" ]
  });
};
export const respondWithNotAllowedError = (res: Response<ErrorResponse>, customMessages?: string[]) => {
  return res.status(401).json({
    responseMsg: "Not allowed",
    error: new Error("Client not allowed error"),
    errorMessages: customMessages ? customMessages : [ "Could not resolve model id" ]
  });
};
export const respondWithWrongInputError = (res: Response<ErrorResponse>, { responseMsg, error, customMessages }: { responseMsg?: string; error?: Error; customMessages?: string[]; }) => {
  const err = error || new InvalidDataError("Invalid Input", customMessages || [ "Invalid data sent by user" ]);
  return res.status(400).json({
    responseMsg: responseMsg || "Invalid User Input",
    error: err,
    errorMessages: customMessages || [ "Invalid data sent by user" ]
  });
};
export const respondWithNoUserError = (res: Response<ErrorResponse>, { responseMsg, error, errorMessages }: { responseMsg?: string; error?: Error; errorMessages?: string[]; }) => {
  const err = error || new AuthNotLoggedInError("Login Error", [ "Logged in user data could not be resolved" ]);
  return res.status(401).json({
    responseMsg: responseMsg || "Auth Login Error",
    error: err,
    errorMessages: errorMessages || [ "Logged in user data could not be resolved" ]
  });
};

export const objectIsEmtpy = (obj: any): boolean => {
  return obj && Object.keys(obj).length === 0  && Object.getPrototypeOf(obj) === Object.prototype;
};
export const getBooleanFromString = (string: string) => {
  if (!string || typeof string !== "string") throw new Error("Wrong data type for conversion");
  return (string === "true" || string === "TRUE" || string === "True") ? true : false; 
};

export const validateRequiredParams = (requiredParameters: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errorMessages: string[] = [];
    for (const requiredParam of requiredParameters) {
      if (!req.params[requiredParam]) {
        errorMessages.push(`Required parameter: ${requiredParameters} is missing from the Request`);
      }
    }

    return errorMessages.length === 0 ? next() : respondWithNoModelIdError(res, errorMessages);
  }
};
export const validateRequiredDataFieds = (requiredDataFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const errorMessages: string[] = [];
      for (const requiredField of requiredDataFields) {
        if (!req.body[requiredField]) {
          errorMessages.push(`Required data: ${requiredField} is missing from the Request`);
        }
      }
      return errorMessages.length === 0 ? next() : respondWithNoModelIdError(res, errorMessages);
    } catch (error) {
      next(error);
    }
  }
};
export const validateObjectIdParams = (requiredParams: string []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const errorMessages: string[] = [];
      for (const requiredParam of requiredParams) {
        if (req.params[requiredParam.trim()]) {
          if (!Types.ObjectId.isValid(req.params[requiredParam])) {
            errorMessages.push(`Param '${requiredParam}' is not a valid ObjectId string'.`);
          }   
        } else {
          errorMessages.push(`Required params: ${requiredParam} is missing from the Request`);
        }
        
      }
      return errorMessages.length === 0 ? next() : respondWithNoModelIdError(res, errorMessages);
    } catch (error) {
      next(error);
    }
  }
};

type ValidateQueryOpts = { [key: string]: "string" | "number" | "boolean" | "objectid" | "jsonwebtoken"; }
export const validateQueryParams = (allowedQueryParams: ValidateQueryOpts) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const errorMessages: string[] = [];
      const queryKeys: string[] = Object.keys(req.query);
      if (queryKeys.length > 0) {
        for (const queryKey of queryKeys) {
          if (allowedQueryParams[queryKey]) {
            // check correct query types //
            if (allowedQueryParams[queryKey] === "boolean") {
              // should be either true or false //
              if (req.query[queryKey] === "true" || req.query[queryKey] === "false") {
                continue;
              } else {
                return respondWithNoModelIdError(res, [ `Invalid query param: ${queryKey} for request. Expected: <boolean>. Received: ${req.query[queryKey]}` ]);
              }
            } else if (allowedQueryParams[queryKey] === "number") {
              // should be able to parase to number //
              if(!/^\d+$/.test(req.query[queryKey] as string)) {
                return respondWithNoModelIdError(res, [ `Invalid query param: ${queryKey} for request. Expected: <boolean>. Received: ${req.query[queryKey]}` ]);
              }
            } else if (allowedQueryParams[queryKey] === "objectid") {
              if (!Types.ObjectId.isValid(req.query[queryKey] as string)) {
                return respondWithNoModelIdError(res, [ `Invalid query param: ${queryKey} for request. Query param <${queryKey}> is not a valid <ObjectID>.`]);
              }
            } else {
              if(!/^[a-zA-Z]+$/.test(req.query[queryKey] as string)) {
                return respondWithNoModelIdError(res, [ `Invalid query param: ${queryKey} for request. Expected: <string> with only 'A-Z' chars. Received: ${req.query[queryKey]}` ]);
              }
            }
          } else {
            // query not allowed //
            return respondWithNoModelIdError(res, [ "Invalid query for request" ]);
          }
        }
        // assumin all is peachy ... //
        return next();
      } else {
        // no custom query params, move along ..//
        return next();
      }
    } catch (error) {
      next(error);
    }
  }
}