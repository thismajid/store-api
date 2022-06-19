import { Router } from "express";

import { Routes } from "./../interfaces/route.interface";
import CategoryController from "../controllers/category.controller";

export class CategoryRoute implements Routes {
  public router = Router();
  public path = "/categories";
  private controller = new CategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.controller.getAllCategories);

    this.router.get(`${this.path}/:id`, this.controller.getSingleCategory);
  }
}
