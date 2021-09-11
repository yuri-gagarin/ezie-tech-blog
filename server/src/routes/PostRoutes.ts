import type { Router  } from "express";
import type { ICRUDController } from "../_types/abstracts/DefaultController";
import { CRUDRoutesController } from "../_types/abstracts/RoutesTypes";
import { PassportContInstance } from "../server";

export default class PostRoutes extends CRUDRoutesController {
  constructor(router: Router, controller: ICRUDController) {
    super(router, controller);
    this.initialize();
  }

  protected initialize() {
    this.index("/api/posts");
    this.getOne("/api/posts/:post_id");
    this.create("/api/posts");
    this.edit("/api/posts/:post_id");
    this.delete("/api/posts/:post_id");
  }

  protected index(route: string): void {
    super.index(route);
  }
  protected getOne(route: string): void {
    super.getOne(route);
  }
  protected create(route: string): void {
    super.create(route, [ PassportContInstance.authenticate("authStrategy")]);
  }
  protected edit(route: string): void {
    super.edit(route, [ PassportContInstance.authenticate("authStrategy")]);
  } 
  protected delete(route: string): void {
    super.delete(route, [ PassportContInstance.authenticate("authStrategy")]);
  }
};
