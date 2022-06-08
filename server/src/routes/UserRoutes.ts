
import { PassportContInstance } from "../server";
import { CRUDRoutesController } from "../_types/abstracts/RoutesTypes";
import { StrategyNames } from "../controllers/PassportController";
// types //
import type { Router } from "express";
import type { IGenericClientController } from "@/server/src/_types/abstracts/DefaultController";
// helpers, middleware //
import { validateRequiredDataFields, validateAllowedReqBodyData, validateObjectIdParams } from "../controllers/_helpers/generalHelpers";
import { checkforLogin, verifyAdmin, passportGeneralAuthMiddleware } from "../controllers/_helpers/authHelpers"
import { userPasswordChangeMiddleware, verifyUsersModelAccess } from "../controllers/_helpers/usersControllerHelpers";

export default class UserRoutes extends CRUDRoutesController {
  constructor(router: Router, controller: IGenericClientController) {
    super(router, controller);
    this.initialize();
  }

  protected initialize() {
    this.index("/api/users");
    this.getOne("/api/users/:user_id");
    this.create("/api/users");
    this.changePassword("/api/users/change_password");
    this.edit("/api/users/:user_id");
    this.delete("/api/users/:user_id");
  }

  protected index(route: string): void {
    super.index(route, [
      checkforLogin
    ]);
  }
  protected getOne(route: string): void {
    super.getOne(route, [
      checkforLogin,
      validateObjectIdParams([ "user_id" ])
    ]);
  }
  protected create(route: string): void {
    super.create(route, [
      PassportContInstance.authenticate(StrategyNames.AuthStrategy, { session: false }),
      verifyAdmin,
      validateRequiredDataFields([ "userData" ])
    ]);
  }
  protected edit(route: string): void {
    super.edit(route, [
      passportGeneralAuthMiddleware,
      verifyUsersModelAccess,
      validateRequiredDataFields([ "userData" ]),
      validateObjectIdParams([ "user_id" ]) 
    ]);
  } 
  protected changePassword(route: string): void {
    this.router
      .route(route)
      .patch(
        [
          passportGeneralAuthMiddleware,
          validateRequiredDataFields([ "passwordData", "userId" ]),
          validateAllowedReqBodyData({ passwordData: "object", userId: "objectid"  }),
          userPasswordChangeMiddleware
        ],
        this.controller.changePassword
      )
  }
  protected delete(route: string): void {
    super.delete(route, 
      [
        passportGeneralAuthMiddleware,                                // login //
        validateObjectIdParams([ "user_id" ]),                        // validate required user_id param //
        verifyUsersModelAccess,                                       // verify that a User or Admin can access the model //
    ]);
  }
};
