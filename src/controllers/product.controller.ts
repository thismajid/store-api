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

  //   public async addProduct(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const { title, description, price, category, image } = req.body;
  //       const categoryId = await prisma.category.findFirst({
  //         where: {
  //           title: category,
  //         },
  //         select: {
  //           id: true,
  //         },
  //       });
  //       if (!categoryId?.id) {
  //         //todo
  //       }
  //       // await prisma.rating.create({
  //       //   data: {
  //       //     id: 21,
  //       //     rate: 0,
  //       //     count: 0,
  //       //   },
  //       // });
  //       const newProduct = await prisma.product.create({
  //         data: {
  //           title,
  //           price,
  //           description,
  //           authorId: 1,
  //           categoryId: 1,
  //           image,
  //           ratingId: 3,
  //         },
  //       });

  //       // const newProduct = await prisma.product.upsert({
  //       //   where: { id: 21 },
  //       //   update: {
  //       //     title,
  //       //     description,
  //       //     price,
  //       //     authorId: 1,
  //       //     categoryId: categoryId?.id,
  //       //     image,
  //       //     rating: {
  //       //       create: {
  //       //         count: 0,
  //       //         rate: 0,
  //       //       },
  //       //     },
  //       //   },
  //       //   create: {
  //       //     title,
  //       //     description,
  //       //     price,
  //       //     authorId: 1,
  //       //     categoryId: categoryId?.id,
  //       //     image,
  //       //     rating: {
  //       //       create: {
  //       //         count: 0,
  //       //         rate: 0,
  //       //       },
  //       //     },
  //       //   },
  //       // });
  //       // const newRating = await prisma.rating.create({
  //       //   data: {
  //       //     id: 21,
  //       //   },
  //       // });
  //       // const newProduct =
  //       //   categoryId &&
  //       //   (await prisma.product.create({
  //       //     data: {
  //       //       id: 21,

  //       //     },
  //       //   }));
  //       res.json(newProduct);
  //     } catch (err) {
  //       logger.error(err);
  //     }
  //   }

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

  //   public async getAllProductsInCategory(
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ) {
  //     try {
  //       const { categoryName } = req.params;
  //       let products;
  //       products = await productsCategoryRedis.hget("productsInCategory", {
  //         modelName: categoryName,
  //       });
  //       if (!products) {
  //         const category = await prisma.category.findFirst({
  //           where: {
  //             title: categoryName,
  //           },
  //         });
  //         products =
  //           category &&
  //           (await prisma.product.findMany({
  //             where: {
  //               categoryId: category.id,
  //             },
  //             include: {
  //               category: true,
  //               author: {
  //                 select: {
  //                   id: true,
  //                   firstname: true,
  //                   lastname: true,
  //                   email: true,
  //                 },
  //               },
  //             },
  //           }));
  //         await productsCategoryRedis.hmset(
  //           products,
  //           "productsInCategory",
  //           categoryName
  //         );
  //       }
  //       res.json({
  //         message: "all products retrieved successfully",
  //         products,
  //       });
  //     } catch (err) {
  //       logger.error(err);
  //     }
  //   }
}

export default ProductController;
