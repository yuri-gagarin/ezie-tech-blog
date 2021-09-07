import type { Router } from "express";
import type { IGenericController } from "./DefaultController";
 
export abstract class RoutesController {
  protected router: Router
  protected controller: IGenericController
  constructor(router: Router, controller: IGenericController) {
    this.router = router;
    this.controller = controller;
  }

  protected index(route: string): void {
    this.router
      .route(route)
      .get(this.controller.index);
  }
  protected getOne(route: string): void {
    this.router
      .route(route)
      .get(this.controller.getOne);
  }
  protected create(route: string): void {
    this.router
      .route(route)
      .post(this.controller.create);
  }
  protected edit(route: string): void {
    this.router
      .route(route)
      .patch(this.controller.edit);
  }
  protected delete(route: string): void {
    this.router
      .route(route)
      .delete(this.controller.delete)
  }
  
}