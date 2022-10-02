/*
  Warnings:

  - Made the column `boardId` on table `Column` required. This step will fail if there are existing NULL values in that column.
  - Made the column `taskId` on table `Subtask` required. This step will fail if there are existing NULL values in that column.
  - Made the column `columnId` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Column" ALTER COLUMN "boardId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Subtask" ALTER COLUMN "taskId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "columnId" SET NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "photo" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
