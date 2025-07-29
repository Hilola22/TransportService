-- CreateEnum
CREATE TYPE "RoleAdmin" AS ENUM ('ADMIN', 'SUPERADMIN');

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "role" "RoleAdmin" NOT NULL DEFAULT 'ADMIN';
