import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

import logger from "../utils/logger";

const prisma = new PrismaClient();

class CartController {
  constructor() {}

  public async getAllCarts(req: Request, res: Response, next: NextFunction) {
    let carts = await prisma.cart.findMany({
      include: {
        user: true,
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });
    res.json({
      message: "all carts retrieved successfully",
      carts,
    });
    try {
    } catch (err) {
      logger.error(err);
    }
  }
}

export default CartController;
