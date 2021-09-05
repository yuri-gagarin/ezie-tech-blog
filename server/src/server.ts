import express, { Router } from "express";
import type { Request, Response } from "express";
import { parse } from "url";
import { createServer, Server as HTTPServer } from "http";
import next from "next";
import combineRoutes from "./routes/CombineRoutes";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

/* routing here */
const router = Router({});
combineRoutes(router);

/* to rewrite as a class */
(async () => {
  try {
    await app.prepare();
    const server = express();
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

