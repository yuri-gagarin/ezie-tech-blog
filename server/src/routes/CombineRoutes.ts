import { Router } from "express";
import AuthRoutes from "./AuthRoutes";
import AuthController from "../controllers/AuthController";
// admins //
import AdminsController from "../controllers/AdminsController";
import AdminRoutes from "./AdminRoutes";
// posts //
import BlogPostsController from "../controllers/BlogPostsController";
import PostRoutes from "./PostRoutes";
// projects //
import ProjectsController from "../controllers/ProjectsController";
import ProjectRoutes from "./ProjectRoutes";
// tests //
import TestController from "../controllers/TestController";
import TestRoutes from "../routes/TestRoutes";
// users //
import UsersController from "../controllers/UsersController";
import UserRoutes from "./UserRoutes";

export default function combineRoutes(router: Router): void {
  new AuthRoutes(router, new AuthController());
  new AdminRoutes(router, new AdminsController());
  new PostRoutes(router, new BlogPostsController());
  new ProjectRoutes(router, new ProjectsController());
  new TestRoutes(router, new TestController());
  new UserRoutes(router, new UsersController());
};
