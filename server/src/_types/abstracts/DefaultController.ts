import{ Request, Response } from "express";

export interface IGenericController {
  index?: (req: Request, res: Response<any>) => Promise<Response<any>>;
  getOne?: (req: Request, res: Response) => Promise<Response>;
  create?: (req: Request, res: Response) => Promise<Response>;
  edit?: (req: Request, res: Response) => Promise<Response>;
  delete?: (req: Request, res: Response) => Promise<Response>;
}