import { PrismaClient } from "@prisma/client";
import {createAdminUser} from "./seeds/create-admin-user";
import {products} from "./seeds/products";

const prisma = new PrismaClient();

async function main() {
    await prisma.user.createMany({
        data: createAdminUser
    })
    await prisma.products.createMany({
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