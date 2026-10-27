/*
  Warnings:

  - You are about to drop the column `available` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `rfidTag` on the `Book` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Book_rfidTag_key";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "available",
DROP COLUMN "rfidTag";

-- CreateTable
CREATE TABLE "BookCopy" (
    "id" UUID NOT NULL,
    "bookId" UUID NOT NULL,
    "rfidTag" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookCopy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookCopy_rfidTag_key" ON "BookCopy"("rfidTag");

-- AddForeignKey
ALTER TABLE "BookCopy" ADD CONSTRAINT "BookCopy_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
