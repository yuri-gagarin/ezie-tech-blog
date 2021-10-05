import type { Router } from "express";
import { StrategyNames } from "../controllers/PassportController";
import type { RssController } from "../controllers/RssController";
// custom middleware //
import { PassportContInstance  } from "../server";
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
    this.addToReadingList("/api/rss/reading_list_add");
    this.removeFromReadingList("/api/rss/reading_list_remove");
  }
  
  private getRssRoute(route: string): void {
    this.router
      .route(route)
      .get([ rssCorsMiddleware ], this.controller.handleRssRequest);
  }
  private addToReadingList(route: string): void {
    this.router
      .route(route)
      .post(
        [ 
          PassportContInstance.authenticate(StrategyNames.AuthStrategy, { session: false }) 
        ],
        this.controller.handleRemoveFromReadingList
      );
  }
  private removeFromReadingList(route: string): void {
    this.router
      .route(route)
      .patch(
        [ 
          PassportContInstance.authenticate(StrategyNames.AuthStrategy, { session: false }) 
        ], 
        this.controller.handleRemoveFromReadingList 
      );
  }
};
