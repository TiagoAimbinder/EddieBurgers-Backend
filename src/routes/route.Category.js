import { Router } from "express";
import { CategoryController } from "../controller/Category.controller.js";
import { CategoryRequest } from "../middlewares/Category.middleware.js";
import { authJWT } from '../config/utils.js'

export class RouteCategory {

  constructor() {
    this.CategoryCtr = new CategoryController(); 
    this.CategoryReq = new CategoryRequest();
    this.routeCategory = Router();
  }

  routesInit = () => {
    this.routeCategory.post('/create', this.CategoryReq.validateCreate, this.CategoryCtr.createCategory);
    this.routeCategory.get('/getAll/:usu_id', authJWT, this.CategoryReq.validateGetAll, this.CategoryCtr.getAllCategories);
    this.routeCategory.put('/update/:cat_id/:usu_id', authJWT, this.CategoryReq.validateUpdate, this.CategoryCtr.updateCategory);
    this.routeCategory.delete('/delete/:cat_id/:usu_id', authJWT, this.CategoryReq.validateDelete, this.CategoryCtr.deleteCategory);
    return this.routeCategory;
  }




}