import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

import logger from "../utils/logger";
import Redisio from "../services/redis.service";

const prisma = new PrismaClient();
const categoriesRedis = new Redisio("categories");

class CategoryController {
  constructor() {}

  public async getAllCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let categories = await categoriesRedis.hget("categories");
    if (!categories) {
      categories = await prisma.category.findMany({});
      categories && (await categoriesRedis.hmset(categories, "categories"));
    }
    res.json({
      message: "all categories retrieved successfully",
      categories,
    });
    try {
    } catch (err) {
      logger.error(err);
    }
  }
}

export default CategoryController;
