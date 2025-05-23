/*
  Warnings:

  - The primary key for the `Edge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Edge` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Node` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Node` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Edge" DROP CONSTRAINT "Edge_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Edge_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Node" DROP CONSTRAINT "Node_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Node_pkey" PRIMARY KEY ("id");
