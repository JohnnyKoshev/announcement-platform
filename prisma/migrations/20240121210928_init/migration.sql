/*
  Warnings:

  - You are about to drop the column `associatedId` on the `attachments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "Attachments_advertisement_fkey";

-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "Attachments_offer_fkey";

-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "associatedId",
ADD COLUMN     "advertisementId" INTEGER,
ADD COLUMN     "offerId" INTEGER;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_advertisementId_fkey" FOREIGN KEY ("advertisementId") REFERENCES "advertisements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
