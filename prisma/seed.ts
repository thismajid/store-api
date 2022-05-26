import { PrismaClient } from "@prisma/client";
import {createAdminUser} from "./seeds/create-admin-user";
import {categories} from './seeds/categories'
import {products} from "./seeds/products";

const prisma = new PrismaClient();

async function main() {
    await prisma.user.createMany({
        data: createAdminUser
    })
    await prisma.category.createMany({
        data: categories
    })
    await prisma.product.createMany({
        data: products
    })
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });