/*
  Warnings:

  - You are about to drop the column `chatId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `chat_users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[individualUserId,juridicUserId]` on the table `chats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `individualUserId` to the `chats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `juridicUserId` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chat_users" DROP CONSTRAINT "chat_users_chatId_fkey";

-- DropForeignKey
ALTER TABLE "chat_users" DROP CONSTRAINT "chat_users_userId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chatId_fkey";

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "individualUserId" INTEGER NOT NULL,
ADD COLUMN     "juridicUserId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "chatId";

-- DropTable
DROP TABLE "chat_users";

-- CreateIndex
CREATE UNIQUE INDEX "chats_individualUserId_juridicUserId_key" ON "chats"("individualUserId", "juridicUserId");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_recipientId_senderId_fkey" FOREIGN KEY ("recipientId", "senderId") REFERENCES "chats"("individualUserId", "juridicUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_juridicUserId_fkey" FOREIGN KEY ("juridicUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_individualUserId_fkey" FOREIGN KEY ("individualUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
