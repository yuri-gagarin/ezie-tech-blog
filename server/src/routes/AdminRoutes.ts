import { CRUDRoutesController } from "../_types/abstracts/RoutesTypes";
import { PassportContInstance } from "../server";
import { StrategyNames } from "../controllers/PassportController";
// types //
import type { Router  } from "express";
import type { ICRUDController } from "../_types/abstracts/DefaultController";

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
  protected create(route: string): void {
    super.create(route, [
      PassportContInstance.authenticate(StrategyNames.AuthStrategy, { session: false })
    ]);
  }
  protected edit(route: string): void {
    super.edit(route);
  } 
  protected delete(route: string): void {
    super.delete(route);
  }
};
