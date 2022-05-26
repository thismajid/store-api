import App from './app';

import IndexRoute from "./routes/index";
import {ProductsRoute} from "./routes/products";

// @ts-ignore
const app = new App([new IndexRoute(), new ProductsRoute()]);


app.listen();
