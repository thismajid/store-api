import { Router , Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";


import {Routes} from './../interfaces/route.interface'
import logger from "../utils/logger";

const prisma = new PrismaClient();


export class ProductsRoute implements Routes{
    public router = Router();
    public path = '/products';

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path,async (req: Request,res: Response)=>{
            try{
                const products = await prisma.product.findMany({});

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



