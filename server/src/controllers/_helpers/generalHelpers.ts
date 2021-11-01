import type { Response } from "express";

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
}