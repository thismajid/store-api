import { Router } from "express";

import { Routes } from "./../interfaces/route.interface";
import ProductController from "../controllers/product.controller";
import { Validator } from "../middlewares/validator.middleware";
import { createProductSchema } from "../validators/product.validator";

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
      Validator(createProductSchema),
      this.controller.addProduct
    );

    this.router.get(`${this.path}/:id`, this.controller.getSingleProduct);

    this.router.get(
      `${this.path}/category/:categoryName`,
      this.controller.getAllProductsInCategory
    );

    this.router.patch(`${this.path}/:id`, this.controller.updateProduct);

    this.router.put(`${this.path}/:id`, this.controller.updateProduct);

    this.router.delete(`${this.path}/:id`, this.controller.deleteSingleProduct);
  }
}
