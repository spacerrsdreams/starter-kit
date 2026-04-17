-- CreateTable
CREATE TABLE "billing_subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "stripeStatus" TEXT,
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "billing_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "billing_subscription_userId_key" ON "billing_subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "billing_subscription_stripeCustomerId_key" ON "billing_subscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "billing_subscription_stripeSubscriptionId_key" ON "billing_subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "billing_subscription_stripeSubscriptionId_idx" ON "billing_subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "billing_subscription_stripeCustomerId_stripeStatus_idx" ON "billing_subscription"("stripeCustomerId", "stripeStatus");

-- AddForeignKey
ALTER TABLE "billing_subscription" ADD CONSTRAINT "billing_subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
