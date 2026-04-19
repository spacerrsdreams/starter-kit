-- CreateEnum
CREATE TYPE "MessageReaction" AS ENUM ('like', 'unlike');

-- AlterTable
ALTER TABLE "message" ADD COLUMN "reaction" "MessageReaction";

