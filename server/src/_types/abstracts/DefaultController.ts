import{ Request, Response } from "express";

export interface ICRUDController {
  index?: (req: Request, res: Response<any>) => Promise<Response<any>>;
  getOne?: (req: Request, res: Response) => Promise<Response>;
  create?: (req: Request, res: Response) => Promise<Response>;
  edit?: (req: Request, res: Response) => Promise<Response>;
  delete?: (req: Request, res: Response) => Promise<Response>;
};

export interface IGenericAuthController {
  login: (req: Request, res: Response) => Promise<Response>;
  logout: (req: Request, res: Response) => Promise<Response>;
};

export abstract class BasicController {

  protected generalErrorResponse(res: Response, { status, responseMsg, error }: { status?: number, responseMsg?: string, error?: any }): Promise<Response> {
    const _status = status ? status : 500;
    const _responseMsg = responseMsg ? responseMsg : "An error occured";
    const _error = error ? error : new Error("General error occured");
    return Promise.resolve().then(() => {
      return res.status(_status).json({
        responseMsg: _responseMsg,
        error: _error
      });
    });
  }
}
