import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import morganMiddleware from "./middlewares/morgan.middleware";
import logger from "./utils/logger";

dotenv.config();

const app: Express = express();
const port: Number = Number(process.env.PORT) || 3000;

app.use(morganMiddleware);

app.listen(port, () => {
  logger.info(`Server is running on localhost:${port} ...`);
});
