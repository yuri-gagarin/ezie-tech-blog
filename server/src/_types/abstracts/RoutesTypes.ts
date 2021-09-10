import type { Router } from "express";
import type { ICRUDController, IGenericAuthController } from "./DefaultController";
 
export abstract class CRUDRoutesController {
  protected router: Router
  protected controller: ICRUDController;
  constructor(router: Router, controller: (ICRUDController | IGenericAuthController)) {
    this.router = router;
    this.controller = controller as ICRUDController;
  }

  protected index(route: string, middleWare?: any[]): void {
    if (middleWare) {
      this.router
        .route(route)
        .get([ ...middleWare, this.controller.index ]);
    } else {
      this.router
        .route(route)
        .get(this.controller.index);
    }
  
  }
  protected getOne(route: string, middleWare?: any[]): void {
    if (middleWare) {
      this.router
        .route(route)
        .get([ ...middleWare ], this.controller.getOne);
    } else {
      this.router
        .route(route)
        .get(this.controller.getOne);
    }
  }
  protected create(route: string, middleWare?: any[]): void {
    if (middleWare) {
      this.router
        .route(route)
        .post([ ...middleWare, this.controller.create ]);
    } else {
      this.router
        .route(route)
        .post(this.controller.create);
    }
  }
  protected edit(route: string, middleWare?: any[]): void {
    if (middleWare) {
      this.router
        .route(route)
        .patch([ ...middleWare, this.controller.edit ]);
    } else {
      this.router
        .route(route)
        .patch(this.controller.edit);
    }
  }
  protected delete(route: string, middleWare?: any[]): void {
    if (middleWare) {
      this.router
        .route(route)
        .delete([ ...middleWare, this.controller.delete ]);
    } else {
      this.router
        .route(route)
        .delete(this.controller.delete);
      }
  } 
};


