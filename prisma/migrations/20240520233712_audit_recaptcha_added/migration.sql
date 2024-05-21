-- CreateTable
CREATE TABLE "AdminAuditRecaptcha" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL,
    "invalidReason" TEXT NOT NULL,
    "expectedAction" TEXT,
    "score" DOUBLE PRECISION,
    "riskAnalysis" JSONB,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "AdminAuditRecaptcha_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AdminAuditRecaptcha" ADD CONSTRAINT "AdminAuditRecaptcha_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
