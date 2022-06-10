import { Router } from "express";

import { Routes } from "./../interfaces/route.interface";
import CartController from "../controllers/cart.controller";

export class CartRoute implements Routes {
  public router = Router();
  public path = "/carts";
  public controller = new CartController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.controller.getAllCarts);
  }
}
