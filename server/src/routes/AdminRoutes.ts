import { CRUDRoutesController } from "../_types/abstracts/RoutesTypes";
import { PassportContInstance } from "../server";
import { StrategyNames } from "../controllers/PassportController";
// types //
import type { Router  } from "express";
import type { ICRUDController } from "../_types/abstracts/DefaultController";
// helpers //
import { verifyOwnerLevelAccess, verifyAdminModelAccess } from "../controllers/_helpers/adminsControllerHelpers";

export default class AdminRoutes extends CRUDRoutesController {
  constructor(router: Router, controller: ICRUDController) {
    super(router, controller);
    this.initialize();
  }

  protected initialize() {
    this.index("/api/admins");
    this.getOne("/api/admins/:admin_id");
    this.create("/api/admins");
    this.edit("/api/admins/:admin_id");
    this.delete("/api/admins/:admin_id");
  }

  protected index(route: string): void {
    super.index(route);
  }
  protected getOne(route: string): void {
    super.getOne(route);
  }
  // only OWNER LEVEL admins should be able to create new admins //
  protected create(route: string): void {
    super.create(route, [
      PassportContInstance.authenticate(StrategyNames.AuthStrategy, { session: false }),
      verifyOwnerLevelAccess 
    ]);
  }
  // Admins should be able to edit their OWN models //
  // OWNER LEVEL admins should be able to edit all models //
  protected edit(route: string): void {
    super.edit(route, [
      PassportContInstance.authenticate(StrategyNames.AdminAuthStrategy, { session: false }),
      verifyAdminModelAccess
    ]);
  } 
  protected delete(route: string): void {
    super.delete(route);
  }
};
