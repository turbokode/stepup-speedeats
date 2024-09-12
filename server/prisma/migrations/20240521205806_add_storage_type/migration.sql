-- CreateEnum
CREATE TYPE "StorageType" AS ENUM ('LOCAL', 'GOOGLE');

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "storage_type" "StorageType" NOT NULL DEFAULT 'LOCAL';
