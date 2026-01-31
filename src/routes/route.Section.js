import { Router } from "express";
import { SectionController } from "../controller/Section.controller.js";
import { authJWT } from '../config/utils.js'

export class RouteSection {

  constructor() {
    this.SectionCtr = new SectionController(); 
    this.routeSection = Router();
  }

  routesInit = () => {
    // POST: localhost:3000/api/section/create
    this.routeSection.post('/create', this.SectionCtr.create);
    
    // GET: localhost:3000/api/section/getAll
    this.routeSection.get('/getAll', authJWT, this.SectionCtr.getAll);

    this.routeSection.put('/update/:sec_id', this.SectionCtr.update);
    this.routeSection.delete('/delete/:sec_id', this.SectionCtr.delete);
    
    return this.routeSection;
  }
}