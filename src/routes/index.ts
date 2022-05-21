import { Router, Request, Response } from "express";
import logger from "../utils/logger";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const category = await prisma.category.create({
      data: {
        title: "1212",
      },
    });
    const user = await prisma.user.create({
      data: {
        firstname: "majid",
        lastname: "khor",
        email: "mkhorshidian72@gmail.com",
        password: "123456",
      },
    });
    const post = await prisma.post.create({
      data: {
        title: "new post",
        description: "new post description",
        image: "new post image",
        authorId: user.id,
        categoryId: category.id,
      },
    });
    res.send(post);
  } catch (err) {
    logger.error(err);
  }
});

export default router;
