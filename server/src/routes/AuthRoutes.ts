import type { Router } from "express";
import type AuthController from "../controllers/AuthController";
import { passportLoginMiddleware } from "../controllers/_helpers/authHelpers";
// passport instance //
//import { PassportContInstance } from "../server";

export default class AuthRoutes {
  private router: Router;
  private controller: AuthController;

  constructor(router: Router, controller: AuthController) {
    this.router = router;
    this.controller = controller;
    this.initialize();
  }

  private initialize(){
    this.loginRoute();
    this.registerRoute();
    this.logoutRoute();
  }

  private loginRoute() {
    this.router
      .route("/api/login")
      .post([ passportLoginMiddleware, this.controller.login ]);
  }
  private registerRoute() {
    this.router 
      .route("/api/register")
      .post(this.controller.register);
  }
  private logoutRoute() {
    this.router
      .route("/api/logout")
      .delete([ this.controller.logout ]);
  }
};
