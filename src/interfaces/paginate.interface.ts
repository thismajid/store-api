import { Prisma } from "@prisma/client";

export interface Paginate {
  take: number;
  skip: number;
  order: Prisma.SortOrder;
}
