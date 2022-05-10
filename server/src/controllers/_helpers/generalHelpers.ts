import { Types } from "mongoose";
import { GeneralServerError, AuthNotLoggedInError, AuthNotFoundError, InvalidDataError } from "./errorHelperts";
// type imports //
import type { NextFunction, Request, Response } from "express";
import type { ErrorResponse } from "../../_types/auth/authTypes";

/* helper for a general server error */
export const respondWithGeneralServerError = (data: { res: Response<ErrorResponse>; responseMsg?: string; error?: Error; message?: string; errorMessages?: string[]; status?: number; }): Response<ErrorResponse> => {
  const { res, responseMsg = "Server Error",  status = 500, message = "General Server Error", errorMessages } = data;
  const error = data.error || new GeneralServerError(message, errorMessages);
  return res.status(status || 500).json({
    responseMsg, 
    error, 
    errorMessages: error instanceof GeneralServerError ? error.getErrorMessages : [ "A server error has occured" ]
   });
};

/* helper for a general not found error response */
export const respondWithNotFoundError = (res: Response<ErrorResponse>, customMessages?: string[]) => {
  const error = new AuthNotFoundError("Auth Not Found Error", customMessages);
  return res.status(404).json({
    responseMsg: "Not Found Error",
    error,
    errorMessages: error.getErrorMessages
  });
};

/* helper for a general no model id error response */
export const respondWithNoModelIdError = (res: Response<ErrorResponse>, customMessages?: string[]) => {
  return res.status(400).json({
    responseMsg: "Input error",
    error: new Error("Client error"),
    errorMessages: customMessages ? customMessages : [ "Could not resolve model id" ]
  });
};
export const respondWithNotAllowedError = (res: Response<ErrorResponse>, customMessages?: string[], status?: number) => {
  return res.status(status || 401).json({
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

/* data helpers */
// check if an arg is an object and is empty //
export const objectIsEmtpy = (obj: any): boolean => {
  return obj && Object.keys(obj).length === 0  && Object.getPrototypeOf(obj) === Object.prototype;
};
export const getBooleanFromString = (string: string) => {
  if (!string || typeof string !== "string") throw new Error("Wrong data type for conversion");
  return (string === "true" || string === "TRUE" || string === "True") ? true : false; 
};


/* general middleware helpers */
//
export const validateRequiredParams = (requiredParameters: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const errorMessages: string[] = [];
      for (const requiredParam of requiredParameters) {
        if (!req.params[requiredParam]) {
          errorMessages.push(`Required parameter: ${requiredParameters} is missing from the Request`);
        }
      }

      return errorMessages.length === 0 ? next() : respondWithNoModelIdError(res, errorMessages);
    } catch (error) {
      return respondWithGeneralServerError({ res, error })
    }
  }
};
/* middleware to validate required fields in <req.body> object */
export const validateRequiredDataFieds = (requiredDataFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): Response<ErrorResponse> | void => {
    try {
      const errorMessages: string[] = [];
      for (const requiredField of requiredDataFields) {
        if (!req.body[requiredField]) {
          errorMessages.push(`Required data field: <${requiredField}> is missing from the Request`);
        }
      }
      return errorMessages.length === 0 ? next() : respondWithWrongInputError(res, { customMessages: errorMessages });
    } catch (error) {
      return respondWithGeneralServerError({ res, error })
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
                return respondWithNoModelIdError(res, [ `Invalid query param: ${queryKey} for request. Expected: <number>. Received: ${req.query[queryKey]}` ]);
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
};

export type ValidReqBodyType = "string" | "number" | "boolean" | "objectid" | "object";
export type ValidReqBodyData = { [key: string]: ValidReqBodyType; }
export const validateReqBodyData = (allowedReqBodyData: ValidReqBodyData) => {
  return (req: Request, res: Response<ErrorResponse>, next: NextFunction): Response<ErrorResponse> | void => {
    try {
      const errorMessages: string[] = [];
      const reqBodyKeys: string[] = Object.keys(req.body);
      if (reqBodyKeys.length > 0) {
        // validate req.body data types //
        for (const reqBodyKey of reqBodyKeys) {
          if (req.body[reqBodyKey]) {
            // check for correct data type //
            switch(allowedReqBodyData[reqBodyKey]) {
              case "string": {
                if (!/^[a-zA-Z]+$/.test(req.body[reqBodyKey] as string)) {
                  errorMessages.push(`Data field <${reqBodyKey}> should be a STRING. Received <${req.body[reqBodyKey]}>`);
                }
                continue;
              }
              case "number": {
                if (!/^\d+$/.test(req.body[reqBodyKey] as string)) {
                  errorMessages.push(`Data field <${reqBodyKey}> should be a NUMBER. Received <${req.body[reqBodyKey]}>`);
                }
                continue;
              }
              case "boolean": {
                if (req.body[reqBodyKey] !== "true" || req.body[reqBodyKey] !== "false") {
                  errorMessages.push(`Data field <${reqBodyKey}> should be a BOOLEAN. Received <${req.body[reqBodyKey]}>`);
                }
                continue;
              }
              case "objectid": {
                if (!Types.ObjectId.isValid(req.body[reqBodyKey] as string)) {
                  errorMessages.push(`Data field <${reqBodyKey}> should be an OBJECTID. Received <${req.body[reqBodyKey]}>`);
                }
                continue;
              }
              case "object": {
                console.log(typeof req.body[reqBodyKey])
                console.log(req.body[reqBodyKey])
                errorMessages.push(`Could not validate data type of <#${reqBodyKey}> at <191>`);
              }
              default: {
                errorMessages.push(`Could not validate data type of <#${reqBodyKey}>`);
              }
            }
          } else {
            errorMessages.push(`Data field <${reqBodyKey}> is NOT ALLOWED`);
          }
        }
        // return result here //
        // check if <errorMessages> array is empty //
        return errorMessages.length === 0 ? respondWithWrongInputError(res, { responseMsg: "Wrong data input", customMessages: errorMessages }) : next();
      } else {
        return next();
      }
    } catch (error) {
      return res.status(500).json({
        responseMsg: "An error on our end", error, errorMessages: [ "Server error. Please try again later" ]
      })
    }
  }
}
