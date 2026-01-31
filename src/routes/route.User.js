import { Router } from "express";
import { UserController } from "../controller/User.controller.js";
import { AuthCtr } from "../controller/Auth.controller.js";
import { UserRequest } from "../middlewares/User.middleware.js";
import { authJWT } from "../config/utils.js";

export class RouteUser {

  constructor() {
    this.UserReq = new UserRequest();
    this.UserCtr = new UserController();
    this.AuthCtr = new AuthCtr();
    this.routeUser = Router();
  }

  routesInit = () => {
    this.routeUser.post("/login", this.UserReq.validateLogin, this.AuthCtr.login); 
    this.routeUser.post("/register", this.UserReq.validateRegister, this.UserCtr.registerUser); 
    this.routeUser.get("/getAll", authJWT, this.UserCtr.getAllUsers);
    this.routeUser.post("/validateToken", this.AuthCtr.validateToken);

    return this.routeUser;
  }

}