import { Types } from "mongoose";
import type { NextFunction, Request, Response } from "express";

export const respondWithNoModelIdError = (res: Response, customMessages?: string[]) => {
  return res.status(400).json({
    responseMsg: "Input error",
    error: new Error("Client error"),
    errorMessages: customMessages ? customMessages : [ "Could not resolve model id" ]
  });
};
export const respondWithNotAllowedError = (res: Response, customMessages?: string[]) => {
  return res.status(401).json({
    responseMsg: "Not allowed",
    error: new Error("Client not allowed error"),
    errorMessages: customMessages ? customMessages : [ "Could not resolve model id" ]
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
    const errorMessages: string[] = [];
    for (const requiredField of requiredDataFields) {
      if (!req.body[requiredField]) {
        errorMessages.push(`Required data: ${requiredField} is missing from the Request`);
      }
    }

    return errorMessages.length === 0 ? next() : respondWithNoModelIdError(res, errorMessages);
  }
};
export const validateObjectIdParams = (requiredParams: string []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errorMessages: string[] = [];
    for (const requiredParam of requiredParams) {
      if (req.params[requiredParam]) {
        if (!Types.ObjectId.isValid(req.params[requiredParam])) {
          errorMessages.push(`Param '${requiredParam}' is not a valid ObjectId string'.`);
        }   
      } else {
        errorMessages.push(`Required params: ${requiredParam} is missing from the Request`);
      }
      
    }
    return errorMessages.length === 0 ? next() : respondWithNoModelIdError(res, errorMessages);
  }
}