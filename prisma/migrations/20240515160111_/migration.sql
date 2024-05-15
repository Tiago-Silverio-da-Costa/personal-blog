-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profissionId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profissionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profissionId_fkey" FOREIGN KEY ("profissionId") REFERENCES "Profession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
