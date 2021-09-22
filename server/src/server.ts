import express, { Router, Express } from "express";
import next from "next";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
// 
import type { Request, Response } from "express";
// database and routes //
import mongoSetup from "./database/mongoSetup";
import combineRoutes from "./routes/CombineRoutes";
// passport and auth //
import PassportController from "./controllers/PassportController";
import { NextServer } from "next/dist/server/next";

export const PassportContInstance = new PassportController().initialize();

/*
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser(process.env.COOKIE_SECRET));
// 
server.use(PassportContInstance.initialize());
// routing here //
const router = Router({});
combineRoutes(router);


// to rewrite as a class //
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
*/

class Server {
  private server: Express;
  private app: NextServer;
  private handle: any;
  // env vars //
  private dev: boolean = process.env.NODE_ENV !== "production";
  private router: Router;
  private PORT: number | string = process.env.PORT || 3000;


  constructor() {
    this.configureNextApp();
    this.configureServer();
    this.configureRouter();
  }

  public async init(): Promise<any> {
    try {
      await this.configureDB();
      await this.app.prepare();
      this.server.listen(this.PORT, (err?: any) => {
        if (err) throw err;
        console.log(`> Ready on localhost:${this.PORT} - env ${process.env.NODE_ENV}`);
      });
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

  private configureNextApp(): void {
    this.app = next({ dev: this.dev });
    this.handle = this.app.getRequestHandler();
  }
  
  private configureServer(): void {
    this.server = express();
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(cookieParser(process.env.COOKIE_SECRET));
  }
  private configureRouter(): void {
    this.router = Router();
    combineRoutes(this.router);
    this.server.use(this.router);
    this.server.all("*", (req: Request, res: Response) => {
      return this.handle(req, res);
    });
  }
  private async configureDB(): Promise<any> {
    return await mongoSetup();
  }
};

new Server().init()

