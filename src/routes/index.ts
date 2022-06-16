import { Router } from "express";

import { Routes } from "../interfaces/route.interface";

class IndexRoute implements Routes {
  public router = Router();
  public path = "/";

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {}
}

export default IndexRoute;
