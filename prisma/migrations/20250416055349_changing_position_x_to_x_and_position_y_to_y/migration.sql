/*
  Warnings:

  - You are about to drop the column `positionX` on the `Node` table. All the data in the column will be lost.
  - You are about to drop the column `positionY` on the `Node` table. All the data in the column will be lost.
  - Added the required column `x` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `Node` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Node" DROP COLUMN "positionX",
DROP COLUMN "positionY",
ADD COLUMN     "x" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "y" DOUBLE PRECISION NOT NULL;
