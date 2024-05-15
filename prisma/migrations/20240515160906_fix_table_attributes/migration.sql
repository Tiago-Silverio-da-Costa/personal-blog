/*
  Warnings:

  - You are about to drop the column `profissionId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `profissionId` on the `User` table. All the data in the column will be lost.
  - Added the required column `professionId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Profession` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `professionId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_profissionId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profissionId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "profissionId",
ADD COLUMN     "professionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profession" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profissionId",
ADD COLUMN     "professionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
