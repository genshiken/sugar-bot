/*
  Warnings:

  - The primary key for the `feedrecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `feedrecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "feedrecord" DROP CONSTRAINT "feedrecord_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "feedrecord_pkey" PRIMARY KEY ("id");
