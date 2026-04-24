ALTER TABLE "user"
ADD COLUMN "lastActiveAt" TIMESTAMP(3);

UPDATE "user" AS u
SET "lastActiveAt" = s."latestSessionUpdatedAt"
FROM (
  SELECT "userId", MAX("updatedAt") AS "latestSessionUpdatedAt"
  FROM "session"
  GROUP BY "userId"
) AS s
WHERE u."id" = s."userId";
