import express, { Router } from "express";
import next from "next";
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

/* routing here */
const router = Router({});
combineRoutes(router);

// 
export const PassportContInstance = new PassportController().initialize();

/* to rewrite as a class */
(async () => {
  try {
    await app.prepare();
    await mongoSetup();
    const server = express();
    server.use(router);
    server.use(PassportContInstance.initialize());
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

