import { Category } from "./category.interface";

export interface CreateCategory extends Category {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
