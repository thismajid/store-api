import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

import logger from "../utils/logger";
import Redisio from "../services/redis.service";

const prisma = new PrismaClient();
const productRedis = new Redisio("products");
const productsCategoryRedis = new Redisio("productsInCategory");
const categoriesRedis = new Redisio("categories");

class ProductController {
  constructor() {}

  public async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      let products = await productRedis.hget("products");
      if (!products || products.length === 0) {
        products = await prisma.product.findMany({
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
        });
        productRedis.hmset(products, "products");
      }
      res.json({
        message: "all products retrieved successfully",
        products,
      });
    } catch (err) {
      logger.error(err);
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
        //todo
      }
      await prisma.rating.upsert({
        where: { id: 21 },
        update: {
          count: 0,
          rate: 0,
        },
        create: {
          count: 0,
          rate: 0,
        },
      });
      const newProduct = await prisma.product.upsert({
        where: { id: 21 },
        update: {
          title,
          price,
          description,
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
          createdAt: new Date(),
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
      });

      res.json(newProduct);
    } catch (err) {
      logger.error(err);
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
        product = await prisma.product.findUnique({
          where: {
            id: +id,
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
        });
        productRedis.hmset(product, "products");
      }
      res.json({
        message: "product retrieved successfully",
        product,
      });
    } catch (err) {
      logger.error(err);
    }
  }

  public async getAllProductsInCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryName } = req.params;
      let products;
      products = await productsCategoryRedis.hget("productsInCategory", {
        modelName: categoryName,
      });
      if (!products) {
        const category = await prisma.category.findFirst({
          where: {
            name: categoryName,
          },
        });
        products =
          category &&
          (await prisma.product.findMany({
            where: {
              categories: {
                some: {
                  category: {
                    id: category?.id,
                  },
                },
              },
            },
            include: {
              categories: { include: { category: true } },
              author: {
                select: {
                  id: true,
                  firstname: true,
                  lastname: true,
                  email: true,
                },
              },
            },
          }));
        await productsCategoryRedis.hmset(
          products,
          "productsInCategory",
          categoryName
        );
      }
      res.json({
        message: "all products retrieved successfully",
        products,
      });
    } catch (err) {
      logger.error(err);
    }
  }
}

export default ProductController;
