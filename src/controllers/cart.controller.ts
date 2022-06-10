import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

import logger from "../utils/logger";
import Redisio from "../services/redis.service";
import isEmpty from "../utils/isEmpty.util";
import CartService from "../services/cart.service";

const prisma = new PrismaClient();
const cartsRedis = new Redisio("carts");
const cartsService = new CartService();

class CartController {
  constructor() {}

  public async getAllCarts(req: Request, res: Response, next: NextFunction) {
    let carts;
    try {
      carts = await cartsRedis.hget("carts");
      if (isEmpty(carts)) {
        carts = await cartsService.getAllCarts();
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
