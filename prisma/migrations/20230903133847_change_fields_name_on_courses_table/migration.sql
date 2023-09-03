/*
  Warnings:

  - You are about to drop the column `accessTime` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `bannerFilename` on the `courses` table. All the data in the column will be lost.
  - Added the required column `access_time` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `banner_filename` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "accessTime",
DROP COLUMN "bannerFilename",
ADD COLUMN     "access_time" INTEGER NOT NULL,
ADD COLUMN     "banner_filename" TEXT NOT NULL;
