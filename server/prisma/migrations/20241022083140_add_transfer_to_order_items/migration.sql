-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "payment_id" TEXT;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "custommer_id" TEXT,
ADD COLUMN     "restaurant_id" TEXT;

-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN     "mpesa" TEXT NOT NULL DEFAULT '846476284';

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_custommer_id_fkey" FOREIGN KEY ("custommer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
