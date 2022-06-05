import { NextFunction, Request, Response } from "express";

import logger from "./../utils/logger";
import AppError from "../exceptions/AppError";

function errorMiddleware(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  logger.error(
    `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`
  );
  res.status(status).send({
    message,
    status,
  });
}

export default errorMiddleware;
