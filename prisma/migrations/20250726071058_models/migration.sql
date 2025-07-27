-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'CLIENT', 'WORKWER');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(15),
    "role" "Role" NOT NULL DEFAULT 'USER',
    "hashedPassword" TEXT NOT NULL,
    "hashedRefreshToken" TEXT,
    "activationLink" TEXT,
    "is_active" BOOLEAN DEFAULT false,
    "is_approved" BOOLEAN DEFAULT false,
    "forgotPasswordToken" TEXT,
    "forgotPasswordExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(15),
    "is_creator" BOOLEAN DEFAULT false,
    "is_approved" BOOLEAN DEFAULT false,
    "forgotPasswordToken" TEXT,
    "forgotPasswordExpires" TIMESTAMP(3),
    "hashedPassword" TEXT NOT NULL,
    "hashedRefreshToken" TEXT,
    "activationLink" TEXT,
    "is_active" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_activationLink_key" ON "users"("activationLink");

-- CreateIndex
CREATE UNIQUE INDEX "users_forgotPasswordToken_key" ON "users"("forgotPasswordToken");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_phone_key" ON "admins"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "admins_forgotPasswordToken_key" ON "admins"("forgotPasswordToken");

-- CreateIndex
CREATE UNIQUE INDEX "admins_activationLink_key" ON "admins"("activationLink");
