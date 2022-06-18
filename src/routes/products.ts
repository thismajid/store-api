import { Router } from "express";

import { Routes } from "./../interfaces/route.interface";
import ProductController from "../controllers/product.controller";
import { Validator } from "../middlewares/validator.middleware";
import {
  createProductSchema,
  updateProductSchema,
  getSingleProductSchema,
  getProductsByCategoryNameSchema,
  getAllProductsSchema,
} from "../validators/product.validator";

export class ProductsRoute implements Routes {
  public router = Router();
  public path = "/products";
  private controller = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      this.path,
      Validator(getAllProductsSchema),
      this.controller.getAllProducts
    );

    this.router.post(
      this.path,
      Validator(createProductSchema),
      this.controller.addProduct
    );

    this.router.get(
      `${this.path}/:id`,
      Validator(getSingleProductSchema),
      this.controller.getSingleProduct
    );

    this.router.get(
      `${this.path}/category/:categoryName`,
      Validator(getProductsByCategoryNameSchema),
      this.controller.getAllProductsInCategory
    );

    this.router.patch(
      `${this.path}/:id`,
      Validator(updateProductSchema),
      this.controller.updateProduct
    );

    this.router.put(
      `${this.path}/:id`,
      Validator(updateProductSchema),
      this.controller.updateProduct
    );

    this.router.delete(
      `${this.path}/:id`,
      Validator(getSingleProductSchema),
      this.controller.deleteSingleProduct
    );
  }
}
