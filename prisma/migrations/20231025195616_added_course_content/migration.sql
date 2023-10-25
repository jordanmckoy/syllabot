/*
  Warnings:

  - You are about to drop the column `image` on the `Unit` table. All the data in the column will be lost.
  - Added the required column `content` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "image",
ADD COLUMN     "content" TEXT NOT NULL;
