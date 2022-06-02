/*
  Warnings:

  - A unique constraint covering the columns `[ratingId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ratingId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "ratingId" INTEGER NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Rating" (
    "id" SERIAL NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_ratingId_key" ON "Product"("ratingId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "Rating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
