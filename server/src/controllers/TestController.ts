import type { Request, Response } from "express";

export default class TestController {

  index(req: Request, res: Response<any>): Promise<Response<any, Record<string, any>>> {
    console.log(req);
    return Promise.resolve().then(() => {
      return res.status(200).json({
        responseMsg: "All ok",
        data: {
          message: "test ok"
        }
      });
    });
  }
};

