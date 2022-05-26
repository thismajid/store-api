import { PrismaClient } from "@prisma/client";
import {createAdminUser} from "./seeds/create-admin-user";

const prisma = new PrismaClient();

async function main() {
    await prisma.user.createMany({
        data: createAdminUser
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