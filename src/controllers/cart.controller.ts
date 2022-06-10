import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

import logger from "../utils/logger";
import Redisio from "../services/redis.service";
import isEmpty from "../utils/isEmpty.util";

const prisma = new PrismaClient();
const cartsRedis = new Redisio("carts");

class CartController {
  constructor() {}

  public async getAllCarts(req: Request, res: Response, next: NextFunction) {
    // let carts = await prisma.cart.findMany({
    //   include: {
    //     user: true,
    //     cartItems: {
    //       include: {
    //         product: true,
    //       },
    //     },
    //   },
    // });
    let carts;
    try {
      carts = await cartsRedis.hget("carts");
      if (isEmpty(carts)) {
        carts = await prisma.cart.findMany({
          include: {
            user: true,
            cartItems: {
              include: {
                product: true,
              },
            },
          },
        });
        cartsRedis.hmset(carts, "carts");
      }
      res.json({
        message: "all carts retrieved successfully",
        carts,
      });
    } catch (err) {
      logger.error(err);
    }
  }
}

export default CartController;
