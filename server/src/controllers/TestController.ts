import type { Request, Response } from "express";
import type { ICRUDController } from "../_types/abstracts/DefaultController";

export default class TestController implements ICRUDController {

  index = async (req: Request, res: Response<any>): Promise<Response<any, Record<string, any>>> => {
    return Promise.resolve().then(() => {
      return res.status(200).json({
        responseMsg: "All ok",
        data: {
          message: "test ok"
        }
      });
    });
  }

  getOne = async (req: Request, res: Response): Promise<Response> => {
    console.log(req.user);
    return Promise.resolve().then(() => {
      return res.status(200).json({
        responseMsg: "Protected route",
        data: {
          message: "This route should be protected"
        }
      });
    });
  }
};

