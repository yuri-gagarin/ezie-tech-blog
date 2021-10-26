import type { Router  } from "express";
import type { ICRUDController } from "../_types/abstracts/DefaultController";
import { CRUDRoutesController } from "../_types/abstracts/RoutesTypes";
// helpers, middleware //
import { checkforLogin } from "../controllers/_helpers/authHelpers"

export default class UserRoutes extends CRUDRoutesController {
  constructor(router: Router, controller: ICRUDController) {
    super(router, controller);
    this.initialize();
  }

  protected initialize() {
    this.index("/api/users");
    this.getOne("/api/users/:user_id");
    this.create("/api/users");
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
      checkforLogin
    ]);
  }
  protected create(route: string): void {
    super.create(route);
  }
  protected edit(route: string): void {
    super.edit(route);
  } 
  protected delete(route: string): void {
    super.delete(route);
  }
};
