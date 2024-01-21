/*
  Warnings:

  - Added the required column `firstUserEmail` to the `chats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondUserEmail` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "firstUserEmail" TEXT NOT NULL,
ADD COLUMN     "secondUserEmail" TEXT NOT NULL;
