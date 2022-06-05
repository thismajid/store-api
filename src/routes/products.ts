import { Router } from "express";

import { Routes } from "./../interfaces/route.interface";
import ProductController from "../controllers/product.controller";
import { Validator } from "../middlewares/validator.middleware";
import productSchema from "../validators/product.validator";

export class ProductsRoute implements Routes {
  public router = Router();
  public path = "/products";
  private controller = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.controller.getAllProducts);

    this.router.post(
      this.path,
      Validator(productSchema),
      this.controller.addProduct
    );

    this.router.get(`${this.path}/:id`, this.controller.getSingleProduct);

    this.router.get(
      `${this.path}/category/:categoryName`,
      this.controller.getAllProductsInCategory
    );
  }
}
