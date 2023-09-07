/*
  Warnings:

  - Added the required column `order` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "order" INTEGER NOT NULL;
