import App from "./app";

// import IndexRoute from "./routes/index";
import { ProductsRoute } from "./routes/products";
import { CategoryRoute } from "./routes/category";

// @ts-ignore
const app = new App([new ProductsRoute(), new CategoryRoute()]);

app.listen();
