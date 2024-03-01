/*
  Warnings:

  - Made the column `profileImage` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profileImage" SET NOT NULL;
