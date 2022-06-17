// import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import UnprocessableEntityException from "../exceptions/UnprocessableEntityException";

export function Validator(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const params =
      req.method === "GET"
        ? { ...req.params, ...req.query }
        : { ...req.params, ...req.body };
    const { error } = schema.validate(params, {
      abortEarly: false,
      messages: {
        key: "{{key}} ",
      },
    });
    if (error) {
      const { message } = error;
      throw new UnprocessableEntityException(message);
    } else {
      return next();
    }
  };
}
