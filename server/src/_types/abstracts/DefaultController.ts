import{ Request, Response } from "express";

export interface ICRUDController {
  index?: (req: Request, res: Response<any>) => Promise<Response<any>>;
  getOne?: (req: Request, res: Response) => Promise<Response>;
  create?: (req: Request, res: Response) => Promise<Response>;
  edit?: (req: Request, res: Response) => Promise<Response>;
  delete?: (req: Request, res: Response) => Promise<Response>;
  [propName: string]: any;
};
export interface IGenericClientController extends ICRUDController {
  changePassword: (req: Request<any>, res: Response<any>) => Promise<Response<any>>;
};

export interface IGenericAuthController {
  login: (req: Request, res: Response) => Promise<Response>;
  logout: (req: Request, res: Response) => Promise<Response>;
};

export abstract class BasicController {

  protected async generalErrorResponse(res: Response, opts: { status?: number, responseMsg?: string, error?: any, errorMessages?: string[] }): Promise<Response<any>> {
    const status = opts && opts.status ? opts.status : 500;
    const responseMsg = opts && opts.responseMsg ? opts.responseMsg : "An error occured";
    const error = opts && opts.error ? opts.error : new Error("General error occured");
    const errorMessages = opts && opts.errorMessages ? opts.errorMessages : [ "Something went wrong try again"];

    return res.status(status).json({ responseMsg, error, errorMessages });
  }
  protected async userInputErrorResponse(res: Response, customMessages?: string[]): Promise<Response>  {
    const responseMsg = "Error: Invalid input";
    const error = new Error("User Input Error");
    const errorMessages: string[] = customMessages ? customMessages : [ "Seems like you entered something wrong" ];
    return res.status(400).json({ responseMsg, error, errorMessages });
  }
  protected async notFoundErrorResponse(res: Response, customMessages?: string[]): Promise<Response> {
    const responseMsg = "Error: Not Found";
    const error = new Error("Data not Found");
    const errorMessages: string[] = customMessages ? customMessages : [ "Seems like we could not find what you're lookuing for"];
    return res.status(404).json({ responseMsg, error, errorMessages });
  }
  protected async notAllowedErrorResponse(res: Response, customMessages?: string[]): Promise<Response> {
    const responseMsg = "Error: Not Allowed";
    const error = new Error("Action not Allowed");
    const errorMessages: string[] = customMessages ? customMessages : [ "You are not authorized to perform this action" ]
    return res.status(401).json({ responseMsg, error, errorMessages });
  }
}
