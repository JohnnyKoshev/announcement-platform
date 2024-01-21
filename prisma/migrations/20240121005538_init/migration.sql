/*
  Warnings:

  - You are about to drop the column `individualId` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `juridicId` on the `chats` table. All the data in the column will be lost.
  - Added the required column `firstUserId` to the `chats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondUserId` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_individualId_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_juridicId_fkey";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "individualId",
DROP COLUMN "juridicId",
ADD COLUMN     "firstUserId" INTEGER NOT NULL,
ADD COLUMN     "secondUserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_firstUserId_fkey" FOREIGN KEY ("firstUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_secondUserId_fkey" FOREIGN KEY ("secondUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
