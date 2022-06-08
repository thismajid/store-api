import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class RatingService {
  constructor() {}

  public async createOrUpdate(id: number) {
    try {
      return await prisma.rating.upsert({
        where: { id: 21 },
        update: {
          count: 0,
          rate: 0,
        },
        create: {
          count: 0,
          rate: 0,
        },
      });
    } catch (err) {
      throw err;
    }
  }
}

export default RatingService;
