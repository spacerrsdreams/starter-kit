-- AlterTable
ALTER TABLE "blog_post"
ADD COLUMN "slug" TEXT,
ADD COLUMN "preview" TEXT,
ADD COLUMN "seoKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Backfill required fields for existing rows
UPDATE "blog_post"
SET
  "slug" = concat('post-', "id"),
  "preview" = left(regexp_replace(("content")::TEXT, '<[^>]*>', '', 'g'), 180)
WHERE "slug" IS NULL OR "preview" IS NULL;

-- Make columns required
ALTER TABLE "blog_post"
ALTER COLUMN "slug" SET NOT NULL,
ALTER COLUMN "preview" SET NOT NULL,
ALTER COLUMN "seoKeywords" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_slug_key" ON "blog_post"("slug");
