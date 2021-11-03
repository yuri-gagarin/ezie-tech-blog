
import { PassportContInstance } from "../server";
import { CRUDRoutesController } from "../_types/abstracts/RoutesTypes";
import { StrategyNames } from "../controllers/PassportController";
// types //
import type { Router } from "express";
import type { ICRUDController } from "@/server/src/_types/abstracts/DefaultController";
// helpers, middleware //
import { validateRequiredDataFieds, validateObjectIdParams } from "../controllers/_helpers/generalHelpers";
import { checkforLogin, verifyAdmin } from "../controllers/_helpers/authHelpers"
import { verifyUsersModelAccess } from "../controllers/_helpers/usersControllerHelpers";

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
    super.create(route, [
      PassportContInstance.authenticate(StrategyNames.AuthStrategy, { session: false }),
      verifyAdmin 
    ]);
  }
  protected edit(route: string): void {
    super.edit(route, [
      PassportContInstance.authenticate(StrategyNames.AuthStrategy, { session: false }),
      verifyUsersModelAccess
    ]);
  } 
  protected delete(route: string): void {
    super.delete(route, [
      PassportContInstance.authenticate(StrategyNames.AuthStrategy, { session: false }),
      verifyUsersModelAccess,
      validateObjectIdParams([ "user_id" ])
    ]);
  }
};
