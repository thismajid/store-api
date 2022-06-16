import { PrismaClient } from "@prisma/client";
import { Paginate } from "../interfaces/paginate.interface";

const prisma = new PrismaClient();

class CartService {
  constructor() {}

  public async getAllCarts() {
    try {
      return await prisma.cart.findMany({
        include: {
          user: true,
          cartItems: {
            include: {
              product: true,
            },
          },
        },
      });
    } catch (err) {
      throw err;
    }
  }

  public async getAllCartsWithPagination(condition: Paginate) {
    try {
      const { skip, take, order } = condition;
      return await prisma.cart.findMany({
        skip,
        take,
        orderBy: [
          {
            id: order,
          },
        ],
        include: {
          user: true,
          cartItems: {
            include: {
              product: true,
            },
          },
        },
      });
    } catch (err) {
      throw err;
    }
  }

  public async getSingleCart(id: Number) {
    try {
      return await prisma.cart.findMany({
        where: {
          id: +id,
        },
        include: {
          user: true,
          cartItems: {
            include: {
              product: true,
            },
          },
        },
      });
    } catch (err) {
      throw err;
    }
  }
}

export default CartService;
