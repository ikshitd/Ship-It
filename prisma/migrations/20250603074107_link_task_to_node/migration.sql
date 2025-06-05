/*
  Warnings:

  - You are about to drop the column `markerEnd` on the `Edge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Edge" DROP COLUMN "markerEnd";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "nodeId" INTEGER;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE SET NULL ON UPDATE CASCADE;
