import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST → Add thumbnail
export async function POST(req) {
  const { videoId, url, s3Key, timestamp, width, height, type } =
    await req.json();

  const thumb = await prisma.thumbnail.create({
    data: {
      videoId,
      url,
      s3Key,
      timestamp,
      width,
      height,
      type,
    },
  });

  return NextResponse.json(thumb);
}
