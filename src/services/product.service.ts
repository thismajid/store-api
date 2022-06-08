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

  public async getProductsByCategoryId(id: number) {
    try {
      return await prisma.product.findMany({
        where: {
          categories: {
            some: {
              category: {
                id,
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
      });
    } catch (err) {
      throw err;
    }
  }

  public async getProductsByCategoryIdPaginate(
    id: number,
    take: number,
    skip: number
  ) {
    try {
      return await prisma.product.findMany({
        take,
        skip,
        where: {
          categories: {
            some: {
              category: {
                id,
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
      });
    } catch (err) {
      throw err;
    }
  }

  public async createOrUpdate(product: any) {
    try {
      const { id, title, description, price, image, category } = product;
      return await prisma.product.upsert({
        where: { id: 21 },
        update: {
          title,
          price,
          description,
          image,
          createdAt: new Date(),
          categories: {
            deleteMany: {},
            create: [
              {
                category: {
                  connect: {
                    id: category,
                  },
                },
              },
            ],
          },
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
                    id: category,
                  },
                },
              },
            ],
          },
          image,
          ratingId: 21,
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
