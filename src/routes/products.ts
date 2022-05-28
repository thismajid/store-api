import { Router , Request, Response } from 'express';

import {Routes} from './../interfaces/route.interface'
import logger from "../utils/logger";
import Redisio from "../services/redis.service";


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
        });

        this.router.get(`${this.path}/:id`, async(req: Request, res: Response)=>{
            try{
                const {id} = req.params
                let product = await this.productRedis.hget('products', {id: +id})
                if(!product){
                    product = await prisma.product.findUnique({where: {id: +id}})
                    this.productRedis.hmset(product, 'products' )
                }
                res.json({
                    message: 'product retrieved successfully',
                    product
                })
            }catch(err){
                logger.error(err)
            }
        })
    }
}



