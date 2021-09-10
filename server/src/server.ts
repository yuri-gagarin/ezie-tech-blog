import express, { Router } from "express";
import next from "next";
import dotenv from "dotenv";
dotenv.config();
// 
import type { Request, Response } from "express";
// database and routes //
import mongoSetup from "./database/mongoSetup";
import combineRoutes from "./routes/CombineRoutes";
// passport and auth //
import PassportController from "./controllers/PassportController";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
// 
export const PassportContInstance = new PassportController({}).initialize();
server.use(PassportContInstance.initialize());
/* routing here */
const router = Router({});
combineRoutes(router);


/* to rewrite as a class */
(async () => {
  try {
    await app.prepare();
    await mongoSetup();
    server.use(router);
    server.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });
    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

