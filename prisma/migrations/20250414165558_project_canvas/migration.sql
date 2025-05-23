/*
  Warnings:

  - Added the required column `projectCanvasId` to the `Edge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectCanvasId` to the `Node` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Edge" ADD COLUMN     "projectCanvasId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Node" ADD COLUMN     "projectCanvasId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ProjectCanvas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectCanvas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_projectCanvasId_fkey" FOREIGN KEY ("projectCanvasId") REFERENCES "ProjectCanvas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_projectCanvasId_fkey" FOREIGN KEY ("projectCanvasId") REFERENCES "ProjectCanvas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
