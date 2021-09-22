
import { passportLoginMiddleware } from "../controllers/_helpers/authHelpers";
import { PassportContInstance } from "../server";
import { StrategyNames } from "../controllers/PassportController";
// types //
import type { Router } from "express";
import type AuthController from "../controllers/AuthController";

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
      .delete([ PassportContInstance.authenticate(StrategyNames.AuthStrategy), this.controller.logout ]);
  }
};
