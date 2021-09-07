import { Router } from "express";
// posts //
import BlogPostsController from "../controllers/BlogPostsController";
import PostRoutes from "./PostRoutes";
// tests //
import TestController from "../controllers/TestController";
import TestRoutes from "../routes/TestRoutes";

export default function combineRoutes(router: Router): void {
  new PostRoutes(router, new BlogPostsController());
  new TestRoutes(router, new TestController());
}