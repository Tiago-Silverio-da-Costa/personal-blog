-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_professionId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "professionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
