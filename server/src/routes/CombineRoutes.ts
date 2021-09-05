import { Router } from "express";
import TestController from "../controllers/TestController";
import TestRoutes from "../routes/TestRoutes";

export default function combineRoutes(router: Router): void {
  new TestRoutes(router, TestController);
}