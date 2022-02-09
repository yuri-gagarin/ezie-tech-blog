
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
    // this.verifyAdminRoute();
    // this.verifyUserRoute();
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
      .delete( this.controller.logout );
  }

  /*
  private verifyAdminRoute() {
    this.router
      .route("/api/verify_admin")
      .get([ 
        PassportContInstance.authenticate(StrategyNames.AdminAuthStrategy, { session: false }) ,
        this.controller.verifyAdmin 
      ]);
  }
  // NOT fully implemented //
  private verifyUserRoute() {
    this.router
      .route("/api/verify_user")
      .get([
        this.controller.verifyUser
      ]);
  }
  */
};
