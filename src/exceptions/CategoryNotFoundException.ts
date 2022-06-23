import AppError from "./AppError";

class CategoryNotFoundException extends AppError {
  constructor(field: string | number) {
    const text =
      typeof field === "string"
        ? `Category with name: ${field} not found`
        : `Category with id: ${field} not found`;
    console.log(text);

    super(404, text);
  }
}

export default CategoryNotFoundException;
