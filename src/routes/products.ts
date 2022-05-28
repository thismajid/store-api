import { Router } from 'express';

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

        this.router.get(`${this.path}/:id`, this.controller.getSingleProduct)
    }
}



