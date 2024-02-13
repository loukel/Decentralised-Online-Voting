/*
  Warnings:

  - A unique constraint covering the columns `[username,eventId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Vote_username_optionId_key";

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "eventId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_username_eventId_key" ON "Vote"("username", "eventId");
