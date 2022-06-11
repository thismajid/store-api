import { PrismaClient } from "@prisma/client";
import { users } from "./seeds/users";
import { categories } from "./seeds/categories";
import { products } from "./seeds/products";
import { ratings } from "./seeds/ratings";
import { carts } from "./seeds/carts";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.user.createMany({
      data: users,
    }),
    prisma.category.createMany({
      data: categories,
    }),
    prisma.rating.createMany({
      data: ratings,
    }),
  ]);
  products.map(async (product: any) => {
    await prisma.product.create({
      data: product,
    });
  });
  carts.map(async (cart: any) => {
    await prisma.cart.create({
      data: cart,
    });
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
