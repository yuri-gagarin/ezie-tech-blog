import type { Router  } from "express";
import type { IGenericController } from "../_types/abstracts/DefaultController";
import { RoutesController } from "../_types/abstracts/RoutesTypes";

export default class PostRoutes extends RoutesController {
  constructor(router: Router, controller: IGenericController) {
    super(router, controller);
    this.initialize();
  }

  protected initialize() {
    this.index("/api/posts");
    this.getOne("/api/posts/:post_id");
    this.create("/api/posts");
    this.edit("/api/posts/posts/:post_id");
    this.delete("/api/posts/:post_id");
  }

  protected index(route: string): void {
    super.index(route);
  }
  protected getOne(route: string): void {
    super.getOne(route);
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
