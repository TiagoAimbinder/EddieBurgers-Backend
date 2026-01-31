import { Router } from "express";
import { RouteCategory } from "./route.Category.js";
import { RouteUser } from "./route.User.js";
import { RouteCurrency } from "./route.Currency.js";
import { RouteExpenses } from "./route.Expenses.js";
import { RouteManangement } from "./route.Manangement.js";
import { RouteManangementWeek } from "./route.ManangementWeek.js";
import { RouteSale } from "./route.Sale.js";
import { RouteSupply } from "./route.Supply.js";
import { RouteCategoryXSupply } from "./route.CategoryXSupply.js";
import { RouteSection } from "./route.Section.js";


export class RouteIndex {


  constructor() {
    this.routeCategory = new RouteCategory();
    this.routeUser = new RouteUser()
    this.routeCurrency = new RouteCurrency()
    this.routeExpenses = new RouteExpenses()
    this.routeManangement = new RouteManangement()
    this.routeManangementWeek = new RouteManangementWeek()
    this.routeSale = new RouteSale()
    this.routeSupply = new RouteSupply();
    this.routeCatXSup = new RouteCategoryXSupply();
    this.routeSection = new RouteSection();

    this.routeIndex = Router();
  } 

  routesInit = () => {
    this.routeIndex.use('/user', this.routeUser.routesInit());
    this.routeIndex.use('/manangement', this.routeManangement.routesInit());
    this.routeIndex.use('/manangementWeek', this.routeManangementWeek.routesInit());
    this.routeIndex.use('/category', this.routeCategory.routesInit());
    this.routeIndex.use('/expenses', this.routeExpenses.routesInit());
    this.routeIndex.use('/currency', this.routeCurrency.routesInit());
    this.routeIndex.use('/saleHistory', this.routeSale.routesInit());
    this.routeIndex.use('/supply', this.routeSupply.routes());
    this.routeIndex.use('/catXSupply', this.routeCatXSup.routes());
    this.routeIndex.use('/section', this.routeSection.routesInit());

    return this.routeIndex;
  };

}
