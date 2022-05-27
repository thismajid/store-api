import { Router , Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import Redis from 'ioredis';


import {Routes} from './../interfaces/route.interface'
import logger from "../utils/logger";
import Redisio from "../services/redis.service";

const prisma = new PrismaClient();
// const RedisDb = new Redis({
//     host: process.env.REDIS_HOST || '127.0.0.1',
//     port: Number(process.env.REDIS_PORT || 6379),
//     db: 6,
//     keyPrefix: process.env.REDIS_PREFIX,
// });



export class ProductsRoute implements Routes{
    public router = Router();
    public path = '/products';
    private productRedis = new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT || 6379),
        db: 6,
        keyPrefix: process.env.REDIS_PREFIX,
    });


    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path,async (req: Request,res: Response)=>{
            try{

                const products = await prisma.product.findUnique({where: {id: 1}});

                console.log(this.productRedis)
                // this.productRedis.set(products)

                // @ts-ignore
                this.productRedis.set('products', JSON.stringify(products))

                res.json({
                    message: 'all products retrieved successfully',
                    products
                })
            }catch(err){
                logger.error(err)
            }
        });
    }
}



