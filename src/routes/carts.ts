import { Router } from "express";

import { Routes } from "./../interfaces/route.interface";
import CartController from "../controllers/cart.controller";
import { Validator } from "../middlewares/validator.middleware";
import { getSingleCartSchema } from "../validators/cart.validator";

export class CartRoute implements Routes {
  public router = Router();
  public path = "/carts";
  public controller = new CartController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.controller.getAllCarts);

    this.router.get(
      `${this.path}/:id`,
      Validator(getSingleCartSchema),
      this.controller.getSingleCart
    );

    this.router.put(`${this.path}/:id`, this.controller.updateCartItems);

    this.router.delete(
      `${this.path}/:id`,
      Validator(getSingleCartSchema),
      this.controller.deleteCartItems
    );
  }
}
