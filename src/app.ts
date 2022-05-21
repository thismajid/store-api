import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port: Number = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server is running on localhost:${port} ...`);
});
