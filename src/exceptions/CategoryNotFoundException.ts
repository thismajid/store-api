import AppError from "./AppError";

class CategoryNotFoundException extends AppError {
  constructor(name: string) {
    super(404, `Category with name ${name} not found`);
  }
}

export default CategoryNotFoundException;
