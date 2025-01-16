/*
  Warnings:

  - Made the column `dueDate` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `priority` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `assignee` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "dueDate" SET NOT NULL,
ALTER COLUMN "priority" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "assignee" SET NOT NULL;
