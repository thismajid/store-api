import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import logger from "../utils/logger";

const prisma = new PrismaClient();

const productsRouter = Router();

productsRouter.get('/',async(req,res,next)=>{
    try{
        const products = await prisma.product.findMany({});

        res.json({
            message: 'all products retrieved successfully',
            products
        })
    }catch(err){
        logger.error(err)
    }
})


export default productsRouter