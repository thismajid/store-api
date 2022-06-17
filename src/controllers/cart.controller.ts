import { Request, Response, NextFunction } from "express";

import logger from "../utils/logger";
import Redisio from "../services/redis.service";
import isEmpty from "../utils/isEmpty.util";
import CartService from "../services/cart.service";
import { Prisma } from "@prisma/client";

const cartsRedis = new Redisio("carts");
const cartsService = new CartService();

class CartController {
  constructor() {}

  public async getAllCarts(req: Request, res: Response, next: NextFunction) {
    let carts;
    try {
      if (!isEmpty(req.query)) {
        const condition = {
          take: Number(req.query.limit) || 10,
          skip: Number(req.query.skip) || 0,
          order: (req.query.sort as Prisma.SortOrder) || "asc",
        };
        carts = await cartsService.getAllCartsWithPagination(condition);
      } else {
        carts = await cartsRedis.hget("carts");
        if (isEmpty(carts)) {
          carts = await cartsService.getAllCarts();
          cartsRedis.hmset(carts, "carts");
        }
      }
      res.json({
        message: "all carts retrieved successfully",
        carts,
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  public async getSingleCart(req: Request, res: Response, next: NextFunction) {
    let cart;
    try {
      const { id } = req.params;
      cart = await cartsRedis.hget("carts", { id: +id });
      if (isEmpty(cart)) {
        cart = await cartsService.getSingleCart(+id);
        cartsRedis.hmset(cart, "cart");
      }
      res.json({
        message: `cart with id: ${id} retrieved successfully`,
        cart,
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  public async updateCartItems(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let cart;
    try {
      const { id } = req.params;
      const { productId, quantity } = req.body;
      cart = await cartsService.getSingleCart(+id);
      if (isEmpty(cart)) {
        return res.json({
          message: `cart with id: ${id} does not exist.`,
        });
      }
      res.json({
        message: `cart with id: ${id} updated successfully`,
        cart,
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  public async deleteCartItems(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let cart;
    try {
      const { id } = req.params;
      cart = await cartsService.getSingleCart(+id);
      if (isEmpty(cart)) {
        return res.json({
          message: `cart with id: ${id} does not exist.`,
        });
      }
      res.json({
        message: `cart with id: ${id} deleted successfully`,
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
}

export default CartController;
