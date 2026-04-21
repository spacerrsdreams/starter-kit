/*
  Warnings:

  - A unique constraint covering the columns `[shareId]` on the table `chat` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "chat" ADD COLUMN     "isSaved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shareId" TEXT;

-- AlterTable
ALTER TABLE "message" ADD COLUMN     "reactionNote" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "chat_shareId_key" ON "chat"("shareId");
