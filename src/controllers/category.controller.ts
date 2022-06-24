import { Request, Response, NextFunction } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

import logger from "../utils/logger";
import Redisio from "../services/redis.service";
import CategoryService from "../services/category.service";
import isEmpty from "../utils/isEmpty.util";
import CategoryNotFoundException from "../exceptions/CategoryNotFoundException";
import CategoryHasExistException from "../exceptions/CategoryHasExistException";

const prisma = new PrismaClient();
const categoriesService = new CategoryService();
const categoriesRedis = new Redisio("categories");

class CategoryController {
  constructor() {}

  public async getAllCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let categories;
      if (!isEmpty(req.query)) {
        const condition = {
          take: Number(req.query.limit) || 10,
          skip: Number(req.query.skip) || 0,
          order: (req.query.sort as Prisma.SortOrder) || "asc",
        };
        categories = await categoriesService.getAllCategoriesWithPagination(
          condition
        );
      } else {
        categories = await categoriesRedis.hget("categories");
        if (!categories) {
          categories = await categoriesService.getAllCategories();
          await categoriesRedis.hmset(categories, "categories");
        }
      }

      res.json({
        message: "all categories retrieved successfully",
        categories,
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  public async getSingleCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      let category = await categoriesRedis.hget("categories", { id: +id });
      if (!category) {
        category = await categoriesService.getSingleCategory(+id);
        categoriesRedis.hmset(category, "categories");
      }
      res.json({
        message: `category with id: ${id} retrieved successfully`,
        category,
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  public async deleteSingleCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const category = await categoriesService.getSingleCategory(+id);
      if (!category) {
        throw new CategoryNotFoundException(+id);
      }
      res.json({
        message: `category with id: ${id} deleted successfully`,
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  public async addCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const foundCategory = await categoriesService.getCategoryByName(name);
      if (foundCategory?.id) throw new CategoryHasExistException(name);
      // const product = {
      //   id: 21,
      //   title,
      //   description,
      //   price,
      //   category: foundCategory?.id,
      //   image,
      // };
      // const [productRating, newProduct] = await Promise.all([
      //   ratingsService.createOrUpdate(21),
      //   productsService.createOrUpdate(product),
      // ]);
      // res.json(newProduct);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
}

export default CategoryController;
