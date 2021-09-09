import { Router } from "express";
import AuthRoutes from "./AuthRoutes";
import AuthController from "../controllers/AuthController";
// posts //
import BlogPostsController from "../controllers/BlogPostsController";
import PostRoutes from "./PostRoutes";
// tests //
import TestController from "../controllers/TestController";
import TestRoutes from "../routes/TestRoutes";

export default function combineRoutes(router: Router): void {
  new AuthRoutes(router, new AuthController());
  new PostRoutes(router, new BlogPostsController());
  new TestRoutes(router, new TestController());
}