import { PrismaClient } from "@prisma/client";
import { createAdminUser } from "./seeds/create-admin-user";
import { categories } from "./seeds/categories";
import { products } from "./seeds/products";
import { ratings } from "./seeds/ratings";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.user.createMany({
      data: createAdminUser,
    }),
    prisma.category.createMany({
      data: categories,
    }),
    prisma.rating.createMany({
      data: ratings,
    }),
  ]);
  products.map(async (product) => {
    await prisma.product.create({
      data: product,
    });
  });
  await prisma.cart.create({
    data: {
      userId: 1,
      cartItems: {
        create: [
          {
            productId: 2,
            quantity: 1,
          },
          {
            productId: 3,
            quantity: 2,
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
