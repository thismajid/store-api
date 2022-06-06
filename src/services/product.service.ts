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

  public async getAllProducts() {
    try {
      return await prisma.product.findMany({
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

  public async getSingleProduct(id: number) {
    try {
      return await prisma.product.findUnique({
        where: {
          id,
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
    } catch (err) {
      throw err;
    }
  }
}

export default ProductService;
