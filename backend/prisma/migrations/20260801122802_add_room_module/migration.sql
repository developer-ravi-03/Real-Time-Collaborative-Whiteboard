/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `users` table. All the data in the column will be lost.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "RoomVisibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "RoomRole" AS ENUM ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');

-- DropIndex
DROP INDEX "users_phoneNumber_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "phoneNumber",
ALTER COLUMN "email" SET NOT NULL;

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "roomCode" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "visibility" "RoomVisibility" NOT NULL DEFAULT 'PRIVATE',
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_members" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "RoomRole" NOT NULL DEFAULT 'VIEWER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rooms_slug_key" ON "rooms"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_roomCode_key" ON "rooms"("roomCode");

-- CreateIndex
CREATE INDEX "rooms_ownerId_idx" ON "rooms"("ownerId");

-- CreateIndex
CREATE INDEX "room_members_roomId_idx" ON "room_members"("roomId");

-- CreateIndex
CREATE INDEX "room_members_userId_idx" ON "room_members"("userId");

-- CreateIndex
CREATE INDEX "room_members_role_idx" ON "room_members"("role");

-- CreateIndex
CREATE UNIQUE INDEX "room_members_roomId_userId_key" ON "room_members"("roomId", "userId");

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
