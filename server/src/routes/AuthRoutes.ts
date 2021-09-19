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
    this.logoutRoute();
  }

  private loginRoute() {
    this.router
      .route("/api/login")
      .post([ passportLoginMiddleware, this.controller.login ]);
  }
  private logoutRoute() {
    this.router
      .route("/api/logout")
      .post([ this.controller.logout ]);
  }
};
