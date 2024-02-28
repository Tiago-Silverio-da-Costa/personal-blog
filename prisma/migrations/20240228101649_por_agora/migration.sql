-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_profissionId_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "authorId" DROP NOT NULL,
ALTER COLUMN "profissionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_profissionId_fkey" FOREIGN KEY ("profissionId") REFERENCES "Profission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
