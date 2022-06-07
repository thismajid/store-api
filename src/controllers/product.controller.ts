import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

import logger from "../utils/logger";
import Redisio from "../services/redis.service";
import CategoryNotFoundException from "../exceptions/CategoryNotFoundException";
import ProductService from "../services/product.service";
import isEmpty from "../utils/isEmpty.util";
import CategoryService from "../services/category.service";

const prisma = new PrismaClient();
const productsService = new ProductService();
const categoriesService = new CategoryService();
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
      const foundCategory = await prisma.category.findFirst({
        where: {
          name: category,
        },
        select: {
          id: true,
        },
      });
      if (!foundCategory?.id) {
        throw new CategoryNotFoundException(category);
      }
      const [productRating, newProduct] = await Promise.all([
        prisma.rating.upsert({
          where: { id: 21 },
          update: {
            count: 0,
            rate: 0,
          },
          create: {
            count: 0,
            rate: 0,
          },
        }),
        prisma.product.upsert({
          where: { id: 21 },
          update: {
            title,
            price,
            description,
            image,
            createdAt: new Date(),
            categories: {
              deleteMany: {},
              create: [
                {
                  category: {
                    connect: {
                      id: foundCategory?.id,
                    },
                  },
                },
              ],
            },
          },
          create: {
            title,
            price,
            description,
            authorId: 1,
            categories: {
              create: [
                {
                  category: {
                    connect: {
                      id: foundCategory?.id,
                    },
                  },
                },
              ],
            },
            image,
            ratingId: 21,
          },
          include: {
            author: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
            categories: { include: { category: true } },
            rating: {
              select: {
                count: true,
                rate: true,
              },
            },
          },
        }),
      ]);
      res.json(newProduct);
    } catch (err) {
      console.log(err);

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
}

export default ProductController;
