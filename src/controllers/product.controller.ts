import {Request, Response, NextFunction} from "express";
import { PrismaClient } from "@prisma/client";

import logger from "../utils/logger";
import Redisio from "../services/redis.service";

const prisma = new PrismaClient();
const productRedis = new Redisio('products')

class ProductController {
    constructor() {
    }

    public async getAllProducts(req: Request, res: Response, next: NextFunction){
        try{
            let products = await productRedis.hget('products');
            if(!products || products.length === 0) {
                products = await prisma.product.findMany({});
                productRedis.hmset(products, 'products' )
            }
            res.json({
                message: 'all products retrieved successfully',
                products
            })
        }catch(err){
            logger.error(err)
        }
    }

    public async getSingleProduct(req: Request, res: Response, next: NextFunction){
        try{
            const {id} = req.params
            let product = await productRedis.hget('products', {id: +id})
            if(!product){
                product = await prisma.product.findUnique({where: {id: +id}})
                productRedis.hmset(product, 'products' )
            }
            res.json({
                message: 'product retrieved successfully',
                product
            })
        }catch(err){
            logger.error(err)
        }
    }

    public async getAllProductsInCategory(req: Request, res: Response, next: NextFunction){
        try{
            const {categoryName} = req.params;
            const category = await prisma.category.findFirst(
                {
                    where: {title: categoryName}
                });
            if(!category){
                // todo
            }
            const products = category && await prisma.product.findMany({
                where: {
                    categoryId: category.id
                },
                include: {
                    category: true,
                    author: {
                        select: {
                            id: true,
                            firstname: true,
                            lastname: true,
                            email: true
                        }
                    }
                }
            });
            res.json({
                message: 'all products retrieved successfully',
                products
            })
        }catch(err){
            logger.error(err);
        }
    }
}

export default ProductController;