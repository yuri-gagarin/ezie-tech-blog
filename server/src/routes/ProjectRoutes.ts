import { PassportContInstance } from "../server";
import { CRUDRoutesController } from "../_types/abstracts/RoutesTypes";
import { StrategyNames } from "../controllers/PassportController";
// types //
import type { Router  } from "express";
import type { ICRUDController } from "../_types/abstracts/DefaultController";
// helpers middleware //
import { verifyOwnerLevelAccess } from "../controllers/_helpers/adminsControllerHelpers";
import { checkforLogin } from "../controllers/_helpers/authHelpers";
import { validateRequiredDataFieds, validateRequiredParams, validateObjectIdParams } from "../controllers/_helpers/generalHelpers";

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
    super.getOne(route, [
      checkforLogin,
      validateRequiredParams([ "project_id" ])
    ]);
  }
  // only owners should be allowed to create projects for now //
  protected create(route: string): void {
    super.create(route, [ 
      PassportContInstance.authenticate(StrategyNames.AdminAuthStrategy, { session: false }),
      verifyOwnerLevelAccess 
    ]);
  }
    // only owners should be allowed to edit projects for now //
  protected edit(route: string): void {
    super.edit(route, [ 
      PassportContInstance.authenticate(StrategyNames.AdminAuthStrategy, { session: false }),
      verifyOwnerLevelAccess,
      validateRequiredDataFieds([ "projectData"]),
      validateObjectIdParams([ "project_id" ])
    ]);
  } 
  protected delete(route: string): void {
    super.delete(route, [ 
      PassportContInstance.authenticate(StrategyNames.AdminAuthStrategy, { session: false }),
      verifyOwnerLevelAccess,
      validateObjectIdParams([ "project_id" ])
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
