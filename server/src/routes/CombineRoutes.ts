import { Router } from "express";
import AuthRoutes from "./AuthRoutes";
import AuthController from "../controllers/AuthController";
// admins //
import AdminsController from "../controllers/AdminsController";
import AdminRoutes from "./AdminRoutes";
// posts //
import BlogPostsController from "../controllers/BlogPostsController";
import PostRoutes from "./PostRoutes";
// tests //
import TestController from "../controllers/TestController";
import TestRoutes from "../routes/TestRoutes";
// users //
import UsersController from "../controllers/UsersController";
import UserRoutes from "./UserRoutes";

export default function combineRoutes(router: Router): void {
  new AuthRoutes(router, new AuthController());
  const adminCont = new AdminsController();
  new AdminRoutes(router, adminCont);
  new PostRoutes(router, new BlogPostsController());
  new TestRoutes(router, new TestController());
  new UserRoutes(router, new UsersController());
};
