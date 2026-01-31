import { Router } from "express";
import { SupplyCtr } from '../controller/Supply.controller.js'


export class RouteSupply {

  constructor() {
    this.routeSupply = new Router();
    this.SupplyCtr = new SupplyCtr(); 
  }


  routes = () => {
    this.routeSupply.post('/create', this.SupplyCtr.create);
    // this.routeSupply.post('/update', this.SupplyCtr.update);

    this.routeSupply.get('/getAll', this.SupplyCtr.getAll);
    this.routeSupply.get('/getByID/:sup_id', this.SupplyCtr.getByID);

    this.routeSupply.put('/update/:sup_id', this.SupplyCtr.update);

    this.routeSupply.delete('/remove/:sup_id', this.SupplyCtr.remove);

    return this.routeSupply;
  }
}