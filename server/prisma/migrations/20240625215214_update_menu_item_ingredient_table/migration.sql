/*
  Warnings:

  - You are about to drop the `MenuItemIngredient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MenuItemIngredient" DROP CONSTRAINT "MenuItemIngredient_ingredient_id_fkey";

-- DropForeignKey
ALTER TABLE "MenuItemIngredient" DROP CONSTRAINT "MenuItemIngredient_menu_item_id_fkey";

-- DropTable
DROP TABLE "MenuItemIngredient";

-- CreateTable
CREATE TABLE "menu_items_ingredients" (
    "ingredient_id" TEXT NOT NULL,
    "menu_item_id" TEXT NOT NULL,

    CONSTRAINT "menu_items_ingredients_pkey" PRIMARY KEY ("ingredient_id","menu_item_id")
);

-- AddForeignKey
ALTER TABLE "menu_items_ingredients" ADD CONSTRAINT "menu_items_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items_ingredients" ADD CONSTRAINT "menu_items_ingredients_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
