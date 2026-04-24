-- CreateEnum
CREATE TYPE "BlogPostLocale" AS ENUM ('EN', 'DE');

-- DropIndex
DROP INDEX "blog_post_slug_key";

-- AlterTable
ALTER TABLE "blog_post"
ADD COLUMN "locale" "BlogPostLocale" NOT NULL DEFAULT 'EN';

-- CreateIndex
CREATE INDEX "blog_post_locale_createdAt_idx" ON "blog_post"("locale", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_slug_locale_key" ON "blog_post"("slug", "locale");
