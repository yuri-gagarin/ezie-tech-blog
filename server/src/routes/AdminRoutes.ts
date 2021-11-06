import { CRUDRoutesController } from "../_types/abstracts/RoutesTypes";
import { PassportContInstance } from "../server";
import { StrategyNames } from "../controllers/PassportController";
// types //
import type { Router  } from "express";
import type { IGenericClientController } from "../_types/abstracts/DefaultController";
// helpers //
import { validateObjectIdParams, validateRequiredDataFieds } from "@/server/src/controllers/_helpers/generalHelpers";
import { verifyOwnerLevelAccess, verifyAdminModelAccess, verifyAdminRoleOrConfirmationChange } from "../controllers/_helpers/adminsControllerHelpers";

export default class AdminRoutes extends CRUDRoutesController {
  constructor(router: Router, controller: IGenericClientController) {
    super(router, controller);
    this.initialize();
  }

  protected initialize() {
    this.index("/api/admins");
    this.getOne("/api/admins/:admin_id");
    this.create("/api/admins");
    this.edit("/api/admins/:admin_id");
    this.delete("/api/admins/:admin_id");
    this.changePassword("/api/admins/password/:admin_id");
  }

  protected index(route: string): void {
    super.index(route);
  }
  protected getOne(route: string): void {
    super.getOne(route, [
      validateObjectIdParams([ "admin_id" ])
    ]);
  }
  // only OWNER LEVEL admins should be able to create new admins //
  protected create(route: string): void {
    super.create(route, [
      PassportContInstance.authenticate(StrategyNames.AuthStrategy, { session: false }),
      verifyOwnerLevelAccess,
      validateRequiredDataFieds([ "adminData" ])
    ]);
  }
  // Admins should be able to edit their OWN models //
  // OWNER LEVEL admins should be able to edit all models //
  protected edit(route: string): void {
    super.edit(route, [
      PassportContInstance.authenticate(StrategyNames.AdminAuthStrategy, { session: false }),
      verifyAdminModelAccess,
      validateObjectIdParams([ "admin_id" ]),
      validateRequiredDataFieds([ "adminData" ]),
      verifyAdminRoleOrConfirmationChange,  // only <owner> level admin can change <Admin.role> or <Admin.confirmation> //
    ]);
  } 
  // Admins should be able to delete their OWN models //
  // OWNER LEVEL admins should be able to delete all models //
  protected delete(route: string): void {
    super.delete(route, [
      PassportContInstance.authenticate(StrategyNames.AdminAuthStrategy, { session: false }),
      verifyAdminModelAccess,
      validateObjectIdParams([ "admin_id" ]),
    ]);
  }

  // password change //
  protected changePassword(route: string): void {
    this.router
      .route(route)
      .patch(
        [ 
          PassportContInstance.authenticate(StrategyNames.AdminAuthStrategy, { session: false }),
          verifyAdminModelAccess,
          validateObjectIdParams([ "admin_id" ]),
          validateRequiredDataFieds([ "passwordChangeData" ]),
        ],
        this.controller.changePassword
      );
  }

  // role change //
  // Only OWNER Level admin should be allowed to do Admin model role change //
  protected changeAdminRole(route: string): void {
    this.router
      .route(route)
      .patch([
        PassportContInstance.authenticate(StrategyNames.AdminAuthStrategy, { session: false }),
        verifyOwnerLevelAccess,
        validateObjectIdParams([ "admin_id" ]),
        validateRequiredDataFieds([ "roleChange" ])
      ]);
  }
};
