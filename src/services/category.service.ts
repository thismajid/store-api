import { PrismaClient } from "@prisma/client";
import { Paginate } from "../interfaces/paginate.interface";

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

  public async getAllCategoriesWithPagination(condition: Paginate) {
    try {
      const { skip, take, order } = condition;
      return await prisma.category.findMany({
        skip,
        take,
        orderBy: [
          {
            id: order,
          },
        ],
      });
    } catch (err) {
      throw err;
    }
  }

  public async getAllCategories() {
    try {
      return await prisma.category.findMany({});
    } catch (err) {
      throw err;
    }
  }
}

export default CategoryService;
