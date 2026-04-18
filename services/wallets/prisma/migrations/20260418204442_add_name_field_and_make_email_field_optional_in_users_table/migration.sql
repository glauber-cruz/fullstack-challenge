-- DropIndex
DROP INDEX "Users_email_key";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "name" TEXT,
ALTER COLUMN "email" DROP NOT NULL;
