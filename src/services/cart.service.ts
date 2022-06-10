import { PrismaClient } from "@prisma/client";

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
}

export default CartService;
