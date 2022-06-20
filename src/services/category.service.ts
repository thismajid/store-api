import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class CategoryService {
  constructor() {}

  public async getCategoryByName(name: string) {
    try {
      return await prisma.category.findFirst({
        where: {
          name,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  public async getSingleCategory(id: number) {
    try {
      return await prisma.category.findUnique({
        where: {
          id,
        },
      });
    } catch (err) {
      throw err;
    }
  }
}

export default CategoryService;
