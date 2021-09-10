import { Router } from "express";
import type { ICRUDController } from "../_types/abstracts/DefaultController";
import { PassportContInstance } from "../server";
import { CRUDRoutesController } from "../_types/abstracts/RoutesTypes";
export default class TestRoutes extends CRUDRoutesController {
  constructor(router: Router, controller: ICRUDController) {
    super(router, controller);
    this.initialize();
  }

  private initialize(): void {
    this.index("/api/test/index")
    this.getOne("/api/test/protected_route");
  }

  protected index(route: string): void {
    super.index(route);
  }
  protected getOne(route: string): void {
    super.getOne(route, [ PassportContInstance.authenticate("authStrategy", { session: false }) ]);
  }

}