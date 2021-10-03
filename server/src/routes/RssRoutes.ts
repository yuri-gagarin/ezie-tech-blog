import type { Router } from "express";
import type { RssController } from "../controllers/RssController";
// custom middleware //
import { rssCorsMiddleware } from "../_helpers/customMiddleware";

export default class RSSRoutes {
  private router: Router;
  private controller: RssController;

  constructor(router: Router, controller: RssController) {
    this.router = router;
    this.controller = controller;
    this.initialize();
  }
  private initialize(): void {
    this.getRssRoute("/api/rss/:option");
  }
  
  private getRssRoute(route: string): void {
    this.router
      .route(route)
      .get([ rssCorsMiddleware ], this.controller.handleRssRequest);
  }
}