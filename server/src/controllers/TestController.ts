import { Request, Response } from "express";

export default class TestController {

  test(req: Request, res: Response) {
    console.log(req);
    return res.status(200).json({
      responseMsg: "All ok",
      data: {
        message: "test ok"
      }
    });
  }
};

