/*
  Warnings:

  - The values [productor] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `productor_id` on the `courses` table. All the data in the column will be lost.
  - Added the required column `producer_id` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('admin', 'producer', 'student');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'student';
COMMIT;

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_productor_id_fkey";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "productor_id",
ADD COLUMN     "producer_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_producer_id_fkey" FOREIGN KEY ("producer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
