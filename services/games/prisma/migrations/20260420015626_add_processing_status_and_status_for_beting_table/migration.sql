-- CreateEnum
CREATE TYPE "BetStatus" AS ENUM ('PENDING', 'CASHED_OUT');

-- CreateEnum
CREATE TYPE "BetProcessingStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Bets" ADD COLUMN     "processingStatus" "BetProcessingStatus" NOT NULL DEFAULT 'PROCESSING',
ADD COLUMN     "status" "BetStatus" NOT NULL DEFAULT 'PENDING';
