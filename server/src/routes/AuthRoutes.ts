
import { PassportContInstance } from "../server";
import { passportLoginMiddleware, passportGeneralAuthMiddleware } from "../controllers/_helpers/authHelpers";
import { StrategyNames } from "../controllers/PassportController";
// helpers //
import { verifyAdminModelAccess } from "../controllers/_helpers/adminsControllerHelpers";
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
    this.uniqueEmailRoute();
    this.deleteAdminProfileRoute();
    this.deleteUserProfileRoute();
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
  private deleteAdminProfileRoute() {
    this.router
      .route("/api/delete_admin_profile")
      .delete(this.controller.deleteAdminProfile);
  }
  private deleteUserProfileRoute() {
    this.router
      .route("/api/delete_user_profile")
      .delete(
        [
          passportGeneralAuthMiddleware
        ],
        this.controller.deleteUserProfile
      );
  }
  private uniqueEmailRoute() {
    this.router
      .route("/api/unique_email")
      .get(this.controller.uniqueEmail);
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
