import AppError from "./AppError";

class ProductNotFoundException extends AppError {
  constructor(id: number) {
    super(404, `Product with id ${id} not found`);
  }
}

export default ProductNotFoundException;
