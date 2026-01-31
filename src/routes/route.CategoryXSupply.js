import { Router } from "express";
import { CategoryXSupplyCtr } from "../controller/CategoryXSupply.controller.js";

export class RouteCategoryXSupply {

  constructor() {
    this.routeCatXSup = new Router();
    this.CategoryXSupplyCtr = new CategoryXSupplyCtr();
  }

  routes = () => {
    this.routeCatXSup.post('/create', this.CategoryXSupplyCtr.create);
    this.routeCatXSup.get('/getAllByCategory/:cat_id', this.CategoryXSupplyCtr.getAllByCategory);
    this.routeCatXSup.put('/updateQuantity/:cxs_id', this.CategoryXSupplyCtr.updateQuantity);
    this.routeCatXSup.delete('/remove/:cxs_id', this.CategoryXSupplyCtr.remove);
    return this.routeCatXSup;
  }
}
