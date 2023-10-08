-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
