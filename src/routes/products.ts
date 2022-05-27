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

                const products = await prisma.product.findMany({});


                // this.productRedis.set(products)

                // @ts-ignore
                this.productRedis.hmset(products, 'products' )

                // console.log(this.productRedis)
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



