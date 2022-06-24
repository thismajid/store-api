import AppError from "./AppError";

class CategoryHasExistException extends AppError {
  constructor(field: string | number) {
    const text =
      typeof field === "string"
        ? `Can not create a category with name, category with name: ${field} has exist`
        : `Can not create a category with id, category with id: ${field} has exist`;
    super(400, text);
  }
}

export default CategoryHasExistException;
