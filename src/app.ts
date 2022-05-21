import express, { Express } from "express";
import dotenv from "dotenv";

import morganMiddleware from "./middlewares/morgan.middleware";
import logger from "./utils/logger";
import routes from "./routes";

dotenv.config();

const app: Express = express();
const port: Number = Number(process.env.PORT) || 3000;

app.use(morganMiddleware);
app.use(routes);

app.listen(port, () => {
  logger.info(`Server is running on localhost:${port} ...`);
});
