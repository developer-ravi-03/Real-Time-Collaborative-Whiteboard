-- CreateEnum
CREATE TYPE "BoardType" AS ENUM ('INFINITE', 'SLIDES');

-- CreateTable
CREATE TABLE "boards" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "BoardType" NOT NULL,
    "settings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "board_pages" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "title" TEXT,
    "canvasData" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "thumbnailUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "board_pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "boards_roomId_idx" ON "boards"("roomId");

-- CreateIndex
CREATE INDEX "boards_createdById_idx" ON "boards"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "boards_roomId_name_key" ON "boards"("roomId", "name");

-- CreateIndex
CREATE INDEX "board_pages_boardId_idx" ON "board_pages"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "board_pages_boardId_pageNumber_key" ON "board_pages"("boardId", "pageNumber");

-- AddForeignKey
ALTER TABLE "boards" ADD CONSTRAINT "boards_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boards" ADD CONSTRAINT "boards_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_pages" ADD CONSTRAINT "board_pages_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
