-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PENDING', 'ADMIN', 'STUDENT', 'TEACHER');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'PENDING',
    "approval_status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "contact_number" TEXT,
    "usn" TEXT,
    "rejection_reason" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_usn_key" ON "profiles"("usn");
