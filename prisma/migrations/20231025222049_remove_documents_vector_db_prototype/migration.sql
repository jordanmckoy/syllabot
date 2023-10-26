/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_unitId_fkey";

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "vector" vector;

-- DropTable
DROP TABLE "Document";
