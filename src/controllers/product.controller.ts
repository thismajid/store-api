import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

import logger from "../utils/logger";
import Redisio from "../services/redis.service";
import CategoryNotFoundException from "../exceptions/CategoryNotFoundException";
import ProductService from "../services/product.service";
import isEmpty from "../utils/isEmpty.util";
import CategoryService from "../services/category.service";
import RatingService from "../services/rating.service";
import ProductNotFoundException from "../exceptions/ProductNotFoundException";

const prisma = new PrismaClient();
const productsService = new ProductService();
const categoriesService = new CategoryService();
const ratingsService = new RatingService();
const productRedis = new Redisio("products");
const productsCategoryRedis = new Redisio("productsInCategory");

class ProductController {
  constructor() {}

  public async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      let products;
      if (!isEmpty(req.query)) {
        const take = Number(req.query.limit) || 10;
        const skip = Number(req.query.skip) || 0;
        products = await productsService.getAllProductsWithPagination(
          take,
          skip
        );
      } else {
        products = await productRedis.hget("products");
        if (!products || products.length === 0) {
          products = await productsService.getAllProducts();
          productRedis.hmset(products, "products");
        }
      }
      res.json({
        message: "all products retrieved successfully",
        products,
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  public async addProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, price, category, image } = req.body;
      const foundCategory = await categoriesService.getCategoryByName(category);
      if (!foundCategory?.id) {
        throw new CategoryNotFoundException(category);
      }
      const product = {
        id: 21,
        title,
        description,
        price,
        category: foundCategory?.id,
        image,
      };
      const [productRating, newProduct] = await Promise.all([
        ratingsService.createOrUpdate(21),
        productsService.createOrUpdate(product),
      ]);
      res.json(newProduct);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  public async getSingleProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      let product = await productRedis.hget("products", { id: +id });
      if (!product) {
        product = await productsService.getSingleProduct(+id);
        productRedis.hmset(product, "products");
      }
      res.json({
        message: "product retrieved successfully",
        product,
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  public async getAllProductsInCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryName } = req.params;
      const foundCategory = await categoriesService.getCategoryByName(
        categoryName
      );
      if (!foundCategory) throw new CategoryNotFoundException(categoryName);
      let products;
      if (req.query) {
        const take = Number(req.query.limit) || 10;
        const skip = Number(req.query.skip) || 0;
        products = await productsService.getProductsByCategoryIdPaginate(
          foundCategory.id,
          take,
          skip
        );
      } else {
        products = await productsCategoryRedis.hget("productsInCategory", {
          modelName: categoryName,
        });
        if (!products) {
          products = await await productsService.getProductsByCategoryId(
            foundCategory?.id
          );
          await productsCategoryRedis.hmset(
            products,
            "productsInCategory",
            categoryName
          );
        }
      }

      res.json({
        message: "all products retrieved successfully",
        products,
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  public async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, description, price, category, image } = req.body;
      const foundCategory = await categoriesService.getCategoryByName(category);
      if (!foundCategory?.id) {
        throw new CategoryNotFoundException(category);
      }
      const product = {
        id: +id,
        title,
        description,
        price,
        category: foundCategory?.id,
        image,
      };
      // await productsService.updateProduct(product);
      res.json({
        message: `product with id ${id} updated successfully`,
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  public async deleteSingleProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const foundProduct = await productsService.getSingleProduct(+id);
      if (!foundProduct) throw new ProductNotFoundException(+id);
      // await productsService.deleteSingleProduct(+id);
      res.json({
        message: `product with id ${id} deleted successfully`,
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
}

export default ProductController;
