/*
  Warnings:

  - You are about to drop the column `videoKey` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the `RawVideo` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[namespace]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `namespace` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RawVideo" DROP CONSTRAINT "RawVideo_userId_fkey";

-- DropForeignKey
ALTER TABLE "RawVideo" DROP CONSTRAINT "RawVideo_videoId_fkey";

-- DropIndex
DROP INDEX "Video_videoKey_key";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "videoKey",
ADD COLUMN     "namespace" TEXT NOT NULL,
ADD COLUMN     "videoLink" TEXT;

-- DropTable
DROP TABLE "RawVideo";

-- CreateIndex
CREATE UNIQUE INDEX "Video_namespace_key" ON "Video"("namespace");
