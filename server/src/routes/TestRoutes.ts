import { Router } from "express";

export default class TestRoutes {
  private router: Router;
  private controller: any;
  constructor(router: Router, controller: any) {
    this.router = router;
    this.controller = new controller();
    this.initialize();
  }

  private initialize(): void {
    console.log(13)
    console.log(this.controller.test)
    this.router.route("/api/test").get(this.controller.test);
  }
}