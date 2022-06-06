import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ProductService {
  constructor() {}

  public async getAllProductsWithPagination(skip: number, take: number) {
    try {
      return await prisma.product.findMany({
        skip,
        take,
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
    } catch (err) {
      throw err;
    }
  }
}

export default ProductService;
