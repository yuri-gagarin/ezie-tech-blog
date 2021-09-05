import { Router } from "express";
import type { IGenericController } from "../_types/abstracts/DefaultController";

export default class TestRoutes {
  private router: Router;
  private controller: IGenericController;
  constructor(router: Router, controller: IGenericController) {
    this.router = router;
    this.controller = controller;
    this.initialize();
  }

  private initialize(): void {
    this.router.route("/api/test").get(this.controller.index);
  }
}