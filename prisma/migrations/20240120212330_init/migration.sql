/*
  Warnings:

  - You are about to drop the column `individualUserId` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `juridicUserId` on the `chats` table. All the data in the column will be lost.
  - Added the required column `individualId` to the `chats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `juridicId` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_individualUserId_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_juridicUserId_fkey";

-- DropIndex
DROP INDEX "chats_individualUserId_juridicUserId_key";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "individualUserId",
DROP COLUMN "juridicUserId",
ADD COLUMN     "individualId" INTEGER NOT NULL,
ADD COLUMN     "juridicId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_juridicId_fkey" FOREIGN KEY ("juridicId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_individualId_fkey" FOREIGN KEY ("individualId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
