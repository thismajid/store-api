import { Router , Request, Response } from 'express';

import {Routes} from './../interfaces/route.interface'
import ProductController from "../controllers/product.controller";

export class ProductsRoute implements Routes{
    public router = Router();
    public path = '/products';
    private controller = new ProductController()

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.controller.getAllProducts);

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



