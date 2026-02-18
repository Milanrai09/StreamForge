-- CreateTable
CREATE TABLE "RawVideo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "videoId" TEXT,
    "videoKey" TEXT NOT NULL,
    "projectSlug" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "s3Url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'upload_url_generated',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RawVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RawVideo_videoId_key" ON "RawVideo"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "RawVideo_videoKey_key" ON "RawVideo"("videoKey");

-- CreateIndex
CREATE UNIQUE INDEX "RawVideo_s3Key_key" ON "RawVideo"("s3Key");

-- CreateIndex
CREATE INDEX "RawVideo_userId_idx" ON "RawVideo"("userId");

-- CreateIndex
CREATE INDEX "RawVideo_projectSlug_idx" ON "RawVideo"("projectSlug");

-- CreateIndex
CREATE INDEX "RawVideo_userId_projectSlug_idx" ON "RawVideo"("userId", "projectSlug");

-- AddForeignKey
ALTER TABLE "RawVideo" ADD CONSTRAINT "RawVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawVideo" ADD CONSTRAINT "RawVideo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;
