import { Router , Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";


import {Routes} from './../interfaces/route.interface'
import logger from "../utils/logger";
import Redisio from "../services/redis.service";

const prisma = new PrismaClient();



export class ProductsRoute implements Routes{
    public router = Router();
    public path = '/products';
    private productRedis = new Redisio('products')


    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path,async (req: Request,res: Response)=>{
            try{
                let products = await this.productRedis.hget('products');
                if(!products) {
                    console.log('into if block')
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
        });
    }
}



