/*
  Warnings:

  - Made the column `priority` on table `Node` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Node" ALTER COLUMN "priority" SET NOT NULL;
