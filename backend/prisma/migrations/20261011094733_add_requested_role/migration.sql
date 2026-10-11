-- CreateEnum
CREATE TYPE "RequestedRole" AS ENUM ('STUDENT', 'TEACHER');

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "requested_role" "RequestedRole";
