/*
  Warnings:

  - You are about to drop the column `custommer_id` on the `payments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_custommer_id_fkey";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "custommer_id",
ADD COLUMN     "customer_id" TEXT;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
