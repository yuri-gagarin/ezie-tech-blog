import { PassportContInstance } from "../server";
import { CRUDRoutesController } from "../_types/abstracts/RoutesTypes";
import { StrategyNames } from "../controllers/PassportController";
// types //
import type { Router  } from "express";
import type { ICRUDController } from "../_types/abstracts/DefaultController";
// helpers middleware //
import { checkforLogin } from "../controllers/_helpers/authHelpers";

export default class ProjectRoutes extends CRUDRoutesController {
  constructor(router: Router, controller: ICRUDController) {
    super(router, controller);
    this.initialize();
  }

  protected initialize() {
    this.index("/api/projects");
    this.getOne("/api/projects/:project_id");
    this.create("/api/projects");
    this.edit("/api/projects/:project_id");
    this.delete("/api/projects/:project_id");
    this.addImage("/api/projects/add_image/:project_id");
    this.removeImage("/api/projects/remove_image/:project_id");
  }

  protected index(route: string): void {
    super.index(route, [
      checkforLogin,
    ]);
  }
  protected getOne(route: string): void {
    super.getOne(route);
  }
  protected create(route: string): void {
    super.create(route, [ 
      PassportContInstance.authenticate(StrategyNames.AdminAuthStrategy, { session: false })
    ]);
  }
  protected edit(route: string): void {
    super.edit(route, [ 
      PassportContInstance.authenticate(StrategyNames.AdminAuthStrategy, { session: false })
    ]);
  } 
  protected delete(route: string): void {
    super.delete(route, [ 
      PassportContInstance.authenticate(StrategyNames.AdminAuthStrategy, { session: false })
    ]);
  }
  private addImage(route: string): void {
    this.router
      .route(route)
      .patch(
        [ 
          PassportContInstance.authenticate(StrategyNames.AdminAuthStrategy, { session: false })
        ],
        this.controller.uploadImage
      );
  }
  private removeImage(route: string): void {
    this.router
      .route(route)
      .patch(
        [
          PassportContInstance.authenticate(StrategyNames.AdminAuthStrategy, { session: false })
        ],
        this.controller.removeImage
      );
  }
};
