import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET → List videos
export async function GET() {
  const videos = await prisma.video.findMany({
    include: {
      renditions: true,
      thumbnails: true,
      logs: true,
      user: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(videos);
}

// POST → Create video entry
export async function POST(req) {
  try {
    const {
      title,
      slug,
      userId,
      originalUrl,
      originalFileName,
      originalFileSize,
      originalDuration,
      s3Bucket,
      s3ProcessedPath,
      description,
      tags,
    } = await req.json();

    const video = await prisma.video.create({
      data: {
        title,
        slug,
        userId,
        originalUrl,
        originalFileName,
        originalFileSize,
        originalDuration,
        s3Bucket,
        s3ProcessedPath,
        description: description || "",
        tags: tags || [],
      },
    });

    return NextResponse.json(video);
  } catch (err) {
    console.error("Create video error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
