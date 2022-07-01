import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

import logger from "../utils/logger";
import Redisio from "../services/redis.service";
import CategoryService from "../services/category.service";
import isEmpty from "../utils/isEmpty.util";
import CategoryNotFoundException from "../exceptions/CategoryNotFoundException";
import CategoryHasExistException from "../exceptions/CategoryHasExistException";
import { CreateCategory } from "../interfaces/category/create-category.interface";

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
      const category: CreateCategory = {
        id: 5,
        name,
      };
      const newCategory = await categoriesService.createOrUpdate(category);
      res.json(newCategory);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  public async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const foundCategory = await categoriesService.getSingleCategory(+id);
      if (!foundCategory?.id) {
        throw new CategoryNotFoundException(name);
      }
      const updateCategory = {
        id: +id,
        name,
      };
      // await categoriesService.updateCategory(updateCategory);
      res.json({
        message: `category with id: ${id} updated successfully`,
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
}

export default CategoryController;
