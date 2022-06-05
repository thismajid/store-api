import AppError from "./AppError";

class UnprocessableEntityException extends AppError {
  constructor(message: string) {
    super(422, message);
  }
}

export default UnprocessableEntityException;
