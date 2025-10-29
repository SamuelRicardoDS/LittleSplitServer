/*
  Warnings:

  - A unique constraint covering the columns `[currentTokenId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."User_username_key";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "currentTokenId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_currentTokenId_key" ON "public"."User"("currentTokenId");
