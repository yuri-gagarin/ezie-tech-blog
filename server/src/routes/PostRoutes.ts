import { PassportContInstance } from "../server";
import { CRUDRoutesController } from "../_types/abstracts/RoutesTypes";
import { StrategyNames } from "../controllers/PassportController";
// custom middleware //
import { checkforLogin } from "../controllers/_helpers/authHelpers"
import { verifyUserModelAndPostId, verifyBlogPostModelAccess } from "../controllers/_helpers/blogPostControllerHelpers";
// types //
import type { Router  } from "express";
import type { ICRUDController } from "../_types/abstracts/DefaultController";

export default class PostRoutes extends CRUDRoutesController {
  constructor(router: Router, controller: ICRUDController) {
    super(router, controller);
    this.initialize();
  }

  protected initialize() {
    this.index("/api/posts");
    this.getOne("/api/posts/:post_id");
    this.create("/api/posts");
    this.toggleLike("/api/posts/toggle_like/:post_id");
    this.edit("/api/posts/:post_id");
    this.delete("/api/posts/:post_id?");
  }

  protected index(route: string): void {
    super.index(route, [
      checkforLogin // checks if user is logged in - does NOT protect the route //
    ]);
  }
  protected getOne(route: string): void {
    super.getOne(route, [
      checkforLogin // checks if user is logged in - does NOT protect the route //
    ]);
  }
  protected create(route: string): void {
    super.create(route, [ 
      PassportContInstance.authenticate(StrategyNames.AuthStrategy, { session: false })
    ]);
  }
  protected edit(route: string): void {
    super.edit(route, [ 
      PassportContInstance.authenticate(StrategyNames.AuthStrategy, { session: false }),
      verifyUserModelAndPostId,
      verifyBlogPostModelAccess
    ]);
  } 
  protected delete(route: string): void {
    super.delete(route, [ 
      PassportContInstance.authenticate(StrategyNames.AuthStrategy, { session: false }),
      verifyUserModelAndPostId,
      verifyBlogPostModelAccess
    ]);
  }

  protected toggleLike(route: string): void {
    this.router
      .route(route)
      .patch(
        [ PassportContInstance.authenticate(StrategyNames.AuthStrategy, { session: false }) ],
        this.controller.toggleLikeBlogPost
      );
  }
};
