import {Request, Response, NextFunction} from "express";
import { PrismaClient } from "@prisma/client";

import logger from "../utils/logger";
import Redisio from "../services/redis.service";

const prisma = new PrismaClient();

class ProductController {
    private productRedis = new Redisio('products')

    constructor() {
    }
}