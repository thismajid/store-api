import App from "./app";

// import IndexRoute from "./routes/index";
import { ProductsRoute } from "./routes/products";
import { CategoryRoute } from "./routes/category";
import { CartRoute } from "./routes/carts";

// @ts-ignore
const app = new App([
  new ProductsRoute(),
  new CategoryRoute(),
  new CartRoute(),
]);

app.listen();
