import {Request, Response, NextFunction} from "express";
import { PrismaClient } from "@prisma/client";

import logger from "../utils/logger";
import Redisio from "../services/redis.service";

const prisma = new PrismaClient();

class ProductController {
    private productRedis = new Redisio('products')

    constructor() {
    }

    public async getAllProducts(req: Request, res: Response, next: NextFunction){
        try{
            let products = await this.productRedis.hget('products');
            if(!products || products.length === 0) {
                products = await prisma.product.findMany({});
                this.productRedis.hmset(products, 'products' )
            }
            res.json({
                message: 'all products retrieved successfully',
                products
            })
        }catch(err){
            logger.error(err)
        }
    }
}

export default ProductController;